package com.arviona.repository;

import com.arviona.model.StoreItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StoreItemRepository extends JpaRepository<StoreItem, String> {
    List<StoreItem> findAllByDeletedFalse();
}
