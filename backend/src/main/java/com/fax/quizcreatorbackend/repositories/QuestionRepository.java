package com.fax.quizcreatorbackend.repositories;

import com.fax.quizcreatorbackend.entities.Question;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionRepository extends CrudRepository<Question, Long> {

    List<Question> findAllByQuiz_IdAndQuiz_User_Username(Long quizId, String username);

    Optional<Question> findByIdAndQuiz_Id(Long questionId, Long quizId);

    void deleteAllByQuiz_Id(Long quizId);

    void deleteByIdAndQuiz_Id(Long questionId, Long quizId);

}
