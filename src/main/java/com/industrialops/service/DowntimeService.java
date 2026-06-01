package com.industrialops.service;

import com.industrialops.model.DowntimeEvent;
import com.industrialops.model.DowntimeEvent.DowntimeStatus;
import com.industrialops.repository.DowntimeEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DowntimeService {

    private final DowntimeEventRepository downtimeRepository;

    public List<DowntimeEvent> findAll() {
        return downtimeRepository.findAll();
    }

    public DowntimeEvent findById(Long id) {
        return downtimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Downtime event not found: " + id));
    }

    public List<DowntimeEvent> findOngoing() {
        return downtimeRepository.findOngoing();
    }

    public List<DowntimeEvent> findByEquipment(Long equipmentId) {
        return downtimeRepository.findByEquipmentId(equipmentId);
    }

    public List<DowntimeEvent> findByDateRange(LocalDateTime from, LocalDateTime to) {
        return downtimeRepository.findByStartTimeBetween(from, to);
    }

    @Transactional
    public DowntimeEvent startEvent(DowntimeEvent event) {
        event.setStartTime(event.getStartTime() != null ? event.getStartTime() : LocalDateTime.now());
        event.setStatus(DowntimeStatus.OPEN);
        event.setEndTime(null);
        return downtimeRepository.save(event);
    }

    @Transactional
    public DowntimeEvent resolveEvent(Long id, String resolvedBy, String correctionTaken) {
        DowntimeEvent event = findById(id);
        event.setEndTime(LocalDateTime.now());
        event.setStatus(DowntimeStatus.RESOLVED);
        event.setResolvedBy(resolvedBy);
        event.setCorrectionTaken(correctionTaken);
        return downtimeRepository.save(event);
    }

    @Transactional
    public DowntimeEvent update(Long id, DowntimeEvent updated) {
        DowntimeEvent existing = findById(id);
        existing.setCategory(updated.getCategory());
        existing.setReason(updated.getReason());
        existing.setRootCause(updated.getRootCause());
        existing.setCorrectionTaken(updated.getCorrectionTaken());
        return downtimeRepository.save(existing);
    }

    public List<Object[]> getSummaryByEquipment(LocalDateTime from, LocalDateTime to) {
        return downtimeRepository.downtimeSummaryByEquipment(from, to);
    }

    public List<Object[]> getSummaryByCategory(LocalDateTime from, LocalDateTime to) {
        return downtimeRepository.downtimeByCategory(from, to);
    }
}