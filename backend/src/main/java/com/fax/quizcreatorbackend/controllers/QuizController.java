package com.fax.quizcreatorbackend.controllers;

import com.fax.quizcreatorbackend.entities.Quiz;
import com.fax.quizcreatorbackend.services.QuizService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/quizzes")

public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping()

    public List<Quiz> findAllQuiz(Principal principal) {
        return quizService.findAllQuizByUsername(principal.getName());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Quiz> findOneQuiz(@PathVariable Long id) {
        Quiz quiz = quizService.findOneQuiz(id);
        if (quiz == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(quiz, HttpStatus.OK);
        }
    }

    @PostMapping()
    public ResponseEntity<Quiz> addQuiz(@RequestBody Quiz quiz, Principal principal) {
        return quizService.addQuiz(quiz, principal.getName());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Quiz> putQuiz(@RequestBody Quiz quiz, @PathVariable Long id, Principal principal) {
        return quizService.updateQuiz(quiz, id, principal.getName());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteQuiz(@PathVariable Long id, Principal principal) {
        return quizService.deleteQuiz(id, principal.getName());
    }

}
