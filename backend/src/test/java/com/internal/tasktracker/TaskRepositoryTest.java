package com.internal.tasktracker;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest(properties = {
        "spring.sql.init.mode=never",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
class TaskRepositoryTest {

    @Autowired
    private TaskRepository taskRepository;

    @BeforeEach
    void setUp() {
        taskRepository.deleteAll();
        // Matches the term via title only.
        taskRepository.save(task("Alpha title match", "unrelated text", "OPEN", false));
        // Matches the term via description only, different status.
        taskRepository.save(task("Beta", "alpha in description", "DONE", false));
        // Matches the term via description but is archived.
        taskRepository.save(task("Gamma", "alpha archived", "OPEN", true));
    }

    @Test
    void searchExcludesArchivedTasks() {
        List<Task> results = taskRepository.searchTasks("%alpha%", null);

        assertThat(results).extracting(Task::getTitle)
                .containsExactlyInAnyOrder("Alpha title match", "Beta");
    }

    @Test
    void searchAppliesStatusFilter() {
        List<Task> results = taskRepository.searchTasks("%alpha%", "OPEN");

        assertThat(results).extracting(Task::getTitle)
                .containsExactly("Alpha title match");
    }

    @Test
    void searchCombinesTermAndStatus() {
        List<Task> results = taskRepository.searchTasks("%alpha%", "DONE");

        assertThat(results).extracting(Task::getTitle)
                .containsExactly("Beta");
    }

    private Task task(String title, String description, String status, boolean archived) {
        Task task = new Task();
        task.setTitle(title);
        task.setDescription(description);
        task.setStatus(status);
        task.setPriority("MEDIUM");
        task.setArchived(archived);
        task.setAssignee("Tester");
        task.setCreatedAt(LocalDateTime.now());
        return task;
    }
}
