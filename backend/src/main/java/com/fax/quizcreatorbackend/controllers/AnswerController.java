package com.fax.quizcreatorbackend.controllers;

import com.fax.quizcreatorbackend.entities.Answer;
import com.fax.quizcreatorbackend.services.AnswerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;


@RestController
@RequestMapping("/api/quizzes/{quizId}/questions/{questionId}/answers")
public class AnswerController {

    private final AnswerService answerService;

    public AnswerController(AnswerService answerService) {
        this.answerService = answerService;
    }

    @GetMapping()
    public List<Answer> findAllAnswers(@PathVariable Long questionId, @PathVariable Long quizId, Principal principal) {
        return answerService.findAllAnswers(questionId, quizId, principal.getName());
    }

    @GetMapping("/{answerId}")
    public ResponseEntity<Answer> findOneAnswer(@PathVariable Long answerId, @PathVariable Long questionId, @PathVariable Long quizId) {
        Answer answer = answerService.findOneAnswer(answerId, questionId, quizId);
        return answer == null ? new ResponseEntity<>(HttpStatus.NOT_FOUND) : new ResponseEntity<>(answer, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<Answer> addAnswer(@PathVariable Long questionId, @PathVariable Long quizId, @RequestBody Answer answer, Principal principal) {
        return answerService.addAnswer(questionId, quizId, answer, principal.getName());
    }


    @PutMapping("/{answerId}")
    public ResponseEntity<Object> updateAnswer(@PathVariable Long answerId, @PathVariable Long questionId, @PathVariable Long quizId, @RequestBody Answer answer, Principal principal) {
        return answerService.updateAnswer(answerId, questionId, quizId, answer, principal.getName());
    }

    @DeleteMapping("/{answerId}")
    public ResponseEntity<Object> deleteAnswer(@PathVariable Long answerId, @PathVariable Long questionId, @PathVariable Long quizId, Principal principal) {
        return answerService.deleteAnswer(answerId, questionId, quizId, principal.getName());

    }

}
