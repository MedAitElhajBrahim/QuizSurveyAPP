package com.fax.quizcreatorbackend.entities;

import org.springframework.lang.NonNull;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.util.Objects;


@Entity
@Table(name="questions")
public class Question {
    @Id
    @GeneratedValue
    private Long id;
    @NotEmpty(message = "description cannot be empty")
    @Size(max = 255)
    private String description;
    @ManyToOne
    private Quiz quiz;

    protected Question() {
    }

    public Question(@NonNull String description) {
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @NonNull
    public String getDescription() {
        return description;
    }

    public void setDescription(@NonNull String description) {
        this.description = description;
    }

    public Quiz getQuiz() {
        return quiz;
    }

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Question question = (Question) o;
        return Objects.equals(id, question.id) &&
                Objects.equals(description, question.description) &&
                Objects.equals(quiz, question.quiz);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, description, quiz);
    }

    @Override
    public String toString() {
        return "Question{" +
                "id=" + id +
                ", description='" + description + '\'' +
                ", quiz=" + quiz +
                '}';
    }
}
