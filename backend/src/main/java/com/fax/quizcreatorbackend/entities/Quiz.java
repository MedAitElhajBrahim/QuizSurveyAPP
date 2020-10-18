package com.fax.quizcreatorbackend.entities;

import org.springframework.lang.NonNull;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.util.Objects;


@Entity
@Table(name="quizzes")
public class Quiz {
    @Id
    @GeneratedValue
    private Long id;
    @NotEmpty(message = "name cannot be empty")
    @Size(max = 30)
    private String name;
    private String description;
    @ManyToOne
    private User user;

    protected Quiz() {
    }

    public Quiz(@NonNull String name, String description, User user) {
        this.name = name;
        this.description = description;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @NonNull
    public String getName() {
        return name;
    }

    public void setName(@NonNull String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Quiz quiz = (Quiz) o;
        return Objects.equals(id, quiz.id) &&
                name.equals(quiz.name) &&
                Objects.equals(description, quiz.description) &&
                Objects.equals(user, quiz.user);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, description, user);
    }

    @Override
    public String toString() {
        return "Quiz{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", user=" + user +
                '}';
    }
}
