
package com.industrialops.repository;

import com.industrialops.model.WorkOrder;
import com.industrialops.model.WorkOrder.WorkOrderStatus;
import com.industrialops.model.WorkOrder.Priority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkOrderRepository extends JpaRepository<WorkOrder, Long> {

    Optional<WorkOrder> findByWorkOrderNumber(String workOrderNumber);

    List<WorkOrder> findByStatus(WorkOrderStatus status);

    List<WorkOrder> findByEquipmentId(Long equipmentId);

    List<WorkOrder> findByAssignedTechnician(String technician);

    List<WorkOrder> findByPriorityAndStatus(Priority priority, WorkOrderStatus status);

    @Query("SELECT w FROM WorkOrder w WHERE w.scheduledDate < :now AND w.status IN ('OPEN','IN_PROGRESS')")
    List<WorkOrder> findOverdue(LocalDateTime now);

    @Query("SELECT w.status, COUNT(w) FROM WorkOrder w GROUP BY w.status")
    List<Object[]> countByStatus();

    @Query("SELECT COUNT(w) FROM WorkOrder w WHERE w.status IN ('OPEN','IN_PROGRESS')")
    long countOpen();
}