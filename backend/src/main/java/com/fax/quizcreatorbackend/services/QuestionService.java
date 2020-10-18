package com.fax.quizcreatorbackend.services;

import com.fax.quizcreatorbackend.entities.Question;
import com.fax.quizcreatorbackend.entities.Quiz;
import com.fax.quizcreatorbackend.repositories.AnswerRepository;
import com.fax.quizcreatorbackend.repositories.QuestionRepository;
import com.fax.quizcreatorbackend.repositories.QuizRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Transactional
@Service
public class QuestionService {
    private final QuizRepository quizRepository;
    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;

    public QuestionService(QuizRepository quizRepository, AnswerRepository answerRepository, QuestionRepository questionRepository) {
        this.quizRepository = quizRepository;
        this.answerRepository = answerRepository;
        this.questionRepository = questionRepository;
    }

    public List<Question> findAllQuestions(Long quizId, String username) {
        return questionRepository.findAllByQuiz_IdAndQuiz_User_Username(quizId, username);
    }

    @PostAuthorize("returnObject!=null?returnObject.quiz.user.username==principal.username:true")
    public Question findOneQuestion(Long questionId, Long quizId) {
        Optional<Question> questionOptional = questionRepository.findByIdAndQuiz_Id(questionId, quizId);
        return questionOptional.orElse(null);
    }

    public ResponseEntity<Question> addQuestion(Question question, Long quizId, String username) {

        if (question.getDescription() == null || question.getDescription().length() == 0) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        question.setId(null);
        Optional<Quiz> quizOptional = quizRepository.findById(quizId);
        if (quizOptional.isPresent()) {
            question.setQuiz(quizOptional.get());
            String quizUsername = quizOptional.get().getUser().getUsername();
            return quizUsername.equals(username) ?
                    new ResponseEntity<>(questionRepository.save(question), HttpStatus.CREATED) : new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<Question> updateQuestion(Question question, Long questionId, Long quizId, String username) {
        if (question.getDescription() == null || question.getDescription().length() == 0) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Optional<Question> questionOptional = questionRepository.findByIdAndQuiz_Id(questionId, quizId);
        if (questionOptional.isPresent()) {

            String savedUsername = questionOptional.get().getQuiz().getUser().getUsername();
            if (savedUsername.equals(username)) {
                questionOptional.get().setDescription(question.getDescription());
                return new ResponseEntity<>(questionRepository.save(questionOptional.get()), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }

        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }

    public ResponseEntity<Object> deleteQuestion(Long questionId, Long quizId, String username) {
        Optional<Question> questionOptional = questionRepository.findByIdAndQuiz_Id(questionId, quizId);
        if (questionOptional.isPresent()) {
            if (questionOptional.get().getQuiz().getUser().getUsername().equals(username)) {
                answerRepository.deleteAllByQuestion_Id(questionId);
                questionRepository.deleteByIdAndQuiz_Id(questionId, quizId);
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
        }

        return new ResponseEntity<>(HttpStatus.OK);

    }
}
