package com.fax.quizcreatorbackend.services;

import com.fax.quizcreatorbackend.entities.Quiz;
import com.fax.quizcreatorbackend.entities.User;
import com.fax.quizcreatorbackend.repositories.AnswerRepository;
import com.fax.quizcreatorbackend.repositories.QuestionRepository;
import com.fax.quizcreatorbackend.repositories.QuizRepository;
import com.fax.quizcreatorbackend.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Transactional
@Service
public class QuizService {
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final UserRepository userRepository;

    public QuizService(QuizRepository quizRepository, QuestionRepository questionRepository, AnswerRepository answerRepository, UserRepository userRepository) {
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
        this.userRepository = userRepository;
    }

    public List<Quiz> findAllQuizByUsername(String username) {
        return quizRepository.findAllByUser_Username(username);
    }

    @PostAuthorize("returnObject!=null?returnObject.user.username==principal.username:true")
    public Quiz findOneQuiz(Long id) {
        Optional<Quiz> optional = quizRepository.findById(id);
        return optional.orElse(null);
    }

    public ResponseEntity<Quiz> addQuiz(Quiz quiz, String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        quiz.setId(null);
        quiz.setUser(user.get());
        quiz.setDescription(quiz.getDescription() == null ? "" : quiz.getDescription());
        if (quiz.getName() == null || quiz.getName().length() == 0) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } else {
            return new ResponseEntity<>(quizRepository.save(quiz), HttpStatus.CREATED);
        }
    }

    public ResponseEntity<Quiz> updateQuiz(Quiz quiz, Long id, String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (quiz.getName() == null || quiz.getName().length() == 0) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        quiz.setId(id);

        Optional<Quiz> quizOptional = quizRepository.findById(id);
        if (quizOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            if (quizOptional.get().getUser().equals(user.get())) {
                quiz.setUser(user.get());
                quiz.setDescription(quiz.getDescription() == null ? "" : quiz.getDescription());
                return new ResponseEntity<>(quizRepository.save(quiz), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }

        }
    }

    public ResponseEntity<Object> deleteQuiz(Long id, String username) {
        Optional<Quiz> quizOptional = quizRepository.findById(id);
        if (quizOptional.isPresent()) {
            if (quizOptional.get().getUser().getUsername().equals(username)) {
                answerRepository.deleteAllByQuestion_Quiz_Id(id);
                questionRepository.deleteAllByQuiz_Id(id);
                quizRepository.deleteById(id);
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }

        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
