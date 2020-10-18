package com.fax.quizcreatorbackend.services;

import com.fax.quizcreatorbackend.entities.Answer;
import com.fax.quizcreatorbackend.entities.Question;
import com.fax.quizcreatorbackend.repositories.AnswerRepository;
import com.fax.quizcreatorbackend.repositories.QuestionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Transactional
@Service
public class AnswerService {
    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;

    public AnswerService(AnswerRepository answerRepository, QuestionRepository questionRepository) {
        this.answerRepository = answerRepository;
        this.questionRepository = questionRepository;
    }

    public List<Answer> findAllAnswers(Long questionId, Long quizId, String username) {
        return answerRepository.findAllByQuestion_IdAndQuestion_Quiz_IdAndQuestion_Quiz_User_Username(questionId, quizId, username);
    }

    @PostAuthorize("returnObject!=null?returnObject.question.quiz.user.username==principal.username:true")
    public Answer findOneAnswer(Long answerId, Long questionId, Long quizId) {
        Optional<Answer> answerOptional = answerRepository.findByIdAndQuestion_IdAndQuestion_Quiz_Id(answerId, questionId, quizId);
        return answerOptional.orElse(null);
    }

    public ResponseEntity<Answer> addAnswer(Long questionId, Long quizId, Answer answer, String username) {
        if (answer.getAnswerText() == null || answer.getAnswerText().length() == 0) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        answer.setId(null);
        answer.setAnswerText(answer.getAnswerText().trim().replaceAll("\\s+", " "));
        Optional<Question> questionOptional = questionRepository.findByIdAndQuiz_Id(questionId, quizId);
        if (questionOptional.isPresent()) {
            if (!questionOptional.get().getQuiz().getUser().getUsername().equals(username)) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
            answer.setQuestion(questionOptional.get());
            return new ResponseEntity<>(answerRepository.save(answer), HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<Object> updateAnswer(Long answerId, Long questionId, Long quizId, Answer answer, String username) {
        if (answer.getAnswerText() == null || answer.getAnswerText().length() == 0) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        answer.setAnswerText(answer.getAnswerText().trim().replaceAll("\\s+", " "));
        Optional<Answer> optionalAnswer = answerRepository.findByIdAndQuestion_IdAndQuestion_Quiz_Id(answerId, questionId, quizId);
        if (optionalAnswer.isPresent()) {
            if (!optionalAnswer.get().getQuestion().getQuiz().getUser().getUsername().equals(username)) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
            optionalAnswer.get().setAnswerText(answer.getAnswerText());
            return new ResponseEntity<>(answerRepository.save(optionalAnswer.get()), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<Object> deleteAnswer(Long answerId, Long questionId, Long quizId, String username) {
        Optional<Answer> answer = answerRepository.findByIdAndQuestion_IdAndQuestion_Quiz_Id(answerId, questionId, quizId);
        if (answer.isPresent() && answer.get().getQuestion().getQuiz().getUser().getUsername().equals(username)) {
            answerRepository.deleteByIdAndQuestion_IdAndQuestion_Quiz_Id(answerId, questionId, quizId);
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
}

