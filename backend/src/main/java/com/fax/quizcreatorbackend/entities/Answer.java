package com.fax.quizcreatorbackend.entities;

import org.springframework.lang.NonNull;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import java.util.Objects;

@Entity
@Table(name="answers")
public class Answer {
    @Id
    @GeneratedValue
    private Long id;
    @NotEmpty(message = "AnswerText cannot be empty")

    private String answerText;
    @ManyToOne
    private Question question;

    protected Answer() {

    }

    public Answer(@NonNull String answerText) {
        this.answerText = answerText.toLowerCase();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @NonNull
    public String getAnswerText() {
        return answerText;
    }

    public void setAnswerText(@NonNull String answerText) {
        this.answerText = answerText.toLowerCase();
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Answer answer = (Answer) o;
        return Objects.equals(id, answer.id) &&
                Objects.equals(answerText, answer.answerText) &&
                Objects.equals(question, answer.question);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, answerText, question);
    }

    @Override
    public String toString() {
        return "Answer{" +
                "id=" + id +
                ", answerText='" + answerText + '\'' +
                ", question=" + question +
                '}';
    }
}
