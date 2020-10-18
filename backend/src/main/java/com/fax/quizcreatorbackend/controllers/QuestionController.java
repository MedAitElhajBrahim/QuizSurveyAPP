package com.fax.quizcreatorbackend.controllers;

import com.fax.quizcreatorbackend.entities.Question;
import com.fax.quizcreatorbackend.services.QuestionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/quizzes/{quizId}/questions")

public class QuestionController {
    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping()
    public List<Question> findAllQuestions(@PathVariable Long quizId, Principal principal) {
        return questionService.findAllQuestions(quizId, principal.getName());
    }

    @GetMapping("/{questionId}")
    public ResponseEntity<Question> findOneQuestion(@PathVariable Long questionId, @PathVariable Long quizId) {
        Question question = questionService.findOneQuestion(questionId, quizId);
        return question == null ? new ResponseEntity<>(HttpStatus.NOT_FOUND) : new ResponseEntity<>(question, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<Question> addQuestion(@RequestBody Question question, @PathVariable Long quizId, Principal principal) {
        return questionService.addQuestion(question, quizId, principal.getName());
    }

    @PutMapping("/{questionId}")
    public ResponseEntity<Question> updateQuestion(@RequestBody Question question, @PathVariable Long questionId, @PathVariable Long quizId, Principal principal) {
        return questionService.updateQuestion(question, questionId, quizId, principal.getName());
    }

    @DeleteMapping("/{questionId}")
    public ResponseEntity<Object> deleteQuestion(@PathVariable Long questionId, @PathVariable Long quizId, Principal principal) {
        return questionService.deleteQuestion(questionId, quizId, principal.getName());

    }
}
