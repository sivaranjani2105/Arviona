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
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN') or hasRole('PRINCIPAL')")
public class AdminController {

    @Autowired private UserRepository userRepository;
    @Autowired private HouseRepository houseRepository;
    @Autowired private BadgeRepository badgeRepository;
    @Autowired private StoreItemRepository storeItemRepository;
    @Autowired private RoleRepository roleRepository;

    // ── Users ─────────────────────────────────────────────────────────────────
    @GetMapping("/users")
    public ResponseEntity<?> getUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> result = users.stream()
                .filter(u -> !u.isDeleted())
                .map(u -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", u.getId());
                    m.put("name", u.getName());
                    m.put("email", u.getEmail());
                    m.put("roles", u.getRoles().stream().map(Role::getName).collect(Collectors.toList()));
                    m.put("createdAt", u.getCreatedAt() != null ? u.getCreatedAt().toString() : "");
                    return m;
                }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> banUser(@PathVariable String id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User u = userRepository.findById(id).orElseThrow(() -> new BadRequestException("User not found"));
        u.setDeleted(true);
        u.setUpdatedBy(userDetails.getName());
        userRepository.save(u);
        return ResponseEntity.ok(Map.of("message", "User banned"));
    }

    // ── Houses ────────────────────────────────────────────────────────────────
    @GetMapping("/houses")
    public ResponseEntity<?> getHouses() {
        return ResponseEntity.ok(houseRepository.findAllByDeletedFalseOrderByTotalPointsDesc()
                .stream().map(h -> Map.of(
                        "id", h.getId(), "name", h.getName(),
                        "colorHex", h.getColorHex(), "totalPoints", h.getTotalPoints()))
                .collect(Collectors.toList()));
    }

    @PostMapping("/houses")
    public ResponseEntity<?> createHouse(@RequestBody Map<String, Object> payload,
                                          @AuthenticationPrincipal UserDetailsImpl userDetails) {
        House house = House.builder()
                .id(UUID.randomUUID().toString())
                .name((String) payload.getOrDefault("name", "New House"))
                .colorHex((String) payload.getOrDefault("colorHex", "#6366F1"))
                .totalPoints(0)
                .createdBy(userDetails.getName())
                .build();
        houseRepository.save(house);
        return ResponseEntity.ok(Map.of("message", "House created", "id", house.getId()));
    }

    @PutMapping("/houses/{id}/reset")
    public ResponseEntity<?> resetHousePoints(@PathVariable String id,
                                               @AuthenticationPrincipal UserDetailsImpl userDetails) {
        House h = houseRepository.findById(id).orElseThrow(() -> new BadRequestException("House not found"));
        h.setTotalPoints(0);
        h.setUpdatedBy(userDetails.getName());
        houseRepository.save(h);
        return ResponseEntity.ok(Map.of("message", "House points reset"));
    }

    // ── Badges ────────────────────────────────────────────────────────────────
    @GetMapping("/badges")
    public ResponseEntity<?> getBadges() {
        return ResponseEntity.ok(badgeRepository.findAllByDeletedFalse().stream()
                .map(b -> Map.of("id", b.getId(), "name", b.getName(),
                        "description", b.getDescription() != null ? b.getDescription() : "",
                        "iconName", b.getIconName(), "rewardXp", b.getRewardXp()))
                .collect(Collectors.toList()));
    }

    @PostMapping("/badges")
    public ResponseEntity<?> createBadge(@RequestBody Map<String, Object> payload,
                                          @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Badge badge = Badge.builder()
                .id(UUID.randomUUID().toString())
                .name((String) payload.getOrDefault("name", "New Badge"))
                .description((String) payload.getOrDefault("description", ""))
                .iconName((String) payload.getOrDefault("iconName", "star"))
                .rewardXp(payload.containsKey("rewardXp") ? ((Number) payload.get("rewardXp")).intValue() : 100)
                .createdBy(userDetails.getName())
                .build();
        badgeRepository.save(badge);
        return ResponseEntity.ok(Map.of("message", "Badge created", "id", badge.getId()));
    }

    // ── Store Items ───────────────────────────────────────────────────────────
    @GetMapping("/store-items")
    public ResponseEntity<?> getStoreItems() {
        return ResponseEntity.ok(storeItemRepository.findAllByDeletedFalse().stream()
                .map(s -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", s.getId());
                    m.put("name", s.getName());
                    m.put("description", s.getDetailsJson() != null ? s.getDetailsJson() : "");
                    m.put("price", s.getPriceCoins());
                    m.put("category", s.getType() != null ? s.getType() : "accessory");
                    m.put("iconEmoji", s.getIconEmoji() != null ? s.getIconEmoji() : "\uD83C\uDF81");
                    return m;
                }).collect(Collectors.toList()));
    }

    @PostMapping("/store-items")
    public ResponseEntity<?> createStoreItem(@RequestBody Map<String, Object> payload,
                                              @AuthenticationPrincipal UserDetailsImpl userDetails) {
        StoreItem item = StoreItem.builder()
                .id(UUID.randomUUID().toString())
                .name((String) payload.getOrDefault("name", "New Item"))
                .detailsJson((String) payload.getOrDefault("description", ""))
                .priceCoins(payload.containsKey("price") ? ((Number) payload.get("price")).intValue() : 100)
                .type((String) payload.getOrDefault("category", "accessory"))
                .iconEmoji((String) payload.getOrDefault("iconEmoji", "\uD83C\uDF81"))
                .createdBy(userDetails.getName())
                .build();
        storeItemRepository.save(item);
        return ResponseEntity.ok(Map.of("message", "Store item created", "id", item.getId()));
    }

    @DeleteMapping("/store-items/{id}")
    public ResponseEntity<?> deleteStoreItem(@PathVariable String id,
                                              @AuthenticationPrincipal UserDetailsImpl userDetails) {
        StoreItem item = storeItemRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Item not found"));
        item.setDeleted(true);
        item.setUpdatedBy(userDetails.getName());
        storeItemRepository.save(item);
        return ResponseEntity.ok(Map.of("message", "Item deleted"));
    }
}
