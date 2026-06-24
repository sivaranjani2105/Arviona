package com.arviona.controller;

import com.arviona.exception.BadRequestException;
import com.arviona.model.*;
import com.arviona.repository.*;
import com.arviona.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/store")
public class StoreController {

    @Autowired
    private StoreItemRepository storeItemRepository;

    @Autowired
    private StudentInventoryRepository inventoryRepository;

    @Autowired
    private StudentGamificationRepository gamificationRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/items")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getStoreItems(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        String studentId = userDetails.getId();

        List<StoreItem> items = storeItemRepository.findAllByDeletedFalse();
        List<StudentInventory> inventory = inventoryRepository.findAllByStudentId(studentId);
        
        StudentGamification profile = gamificationRepository.findByUserIdAndDeletedFalse(studentId)
                .orElseThrow(() -> new BadRequestException("Student profile not found"));

        List<Map<String, Object>> responseItems = items.stream().map(item -> {
            Optional<StudentInventory> invOpt = inventory.stream()
                    .filter(i -> i.getStoreItem().getId().equals(item.getId()))
                    .findFirst();

            Map<String, Object> m = new HashMap<>();
            m.put("id", item.getId());
            m.put("name", item.getName());
            m.put("type", item.getType());
            m.put("priceCoins", item.getPriceCoins());
            m.put("detailsJson", item.getDetailsJson());
            m.put("purchased", invOpt.isPresent());
            m.put("equipped", invOpt.isPresent() && invOpt.get().isEquipped());
            return m;
        }).collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("coinsBalance", profile.getCoinsBalance());
        response.put("items", responseItems);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/purchase/{id}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> purchaseItem(
            @PathVariable("id") String itemId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        
        String studentId = userDetails.getId();
        User student = userRepository.findById(studentId).orElseThrow();

        StoreItem item = storeItemRepository.findById(itemId)
                .orElseThrow(() -> new BadRequestException("Item not found"));

        Optional<StudentInventory> existing = inventoryRepository.findByStudentIdAndStoreItemId(studentId, itemId);
        if (existing.isPresent()) {
            throw new BadRequestException("You already own this item!");
        }

        StudentGamification profile = gamificationRepository.findByUserIdAndDeletedFalse(studentId)
                .orElseThrow(() -> new BadRequestException("Gamification profile not found"));

        if (profile.getCoinsBalance() < item.getPriceCoins()) {
            throw new BadRequestException("Insufficient coins balance!");
        }

        // Deduct coins
        profile.setCoinsBalance(profile.getCoinsBalance() - item.getPriceCoins());
        gamificationRepository.save(profile);

        // Add to inventory
        StudentInventory newInv = StudentInventory.builder()
                .id(UUID.randomUUID().toString())
                .student(student)
                .storeItem(item)
                .equipped(false)
                .unlockedAt(LocalDateTime.now())
                .build();
        inventoryRepository.save(newInv);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Purchase successful!");
        response.put("coinsBalance", profile.getCoinsBalance());
        response.put("itemId", itemId);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/equip/{id}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> equipItem(
            @PathVariable("id") String itemId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        String studentId = userDetails.getId();

        StudentInventory inv = inventoryRepository.findByStudentIdAndStoreItemId(studentId, itemId)
                .orElseThrow(() -> new BadRequestException("Item not owned or in inventory"));

        boolean nowEquipped = !inv.isEquipped();

        if (nowEquipped) {
            // Unequip any other items of the same type
            String itemType = inv.getStoreItem().getType();
            List<StudentInventory> fullInventory = inventoryRepository.findAllByStudentId(studentId);
            
            for (StudentInventory sibling : fullInventory) {
                if (sibling.getStoreItem().getType().equals(itemType) && sibling.isEquipped()) {
                    sibling.setEquipped(false);
                    inventoryRepository.save(sibling);
                }
            }
        }

        inv.setEquipped(nowEquipped);
        inventoryRepository.save(inv);

        Map<String, Object> response = new HashMap<>();
        response.put("message", nowEquipped ? "Item equipped successfully!" : "Item unequipped successfully!");
        response.put("itemId", itemId);
        response.put("equipped", nowEquipped);

        return ResponseEntity.ok(response);
    }
}
