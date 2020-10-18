package com.fax.quizcreatorbackend.repositories;

import com.fax.quizcreatorbackend.entities.Answer;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnswerRepository extends CrudRepository<Answer, Long> {
    List<Answer> findAllByQuestion_Id(Long questionId);

    List<Answer> findAllByQuestion_IdAndQuestion_Quiz_Id(Long questionId, Long quizId);

    List<Answer> findAllByQuestion_IdAndQuestion_Quiz_IdAndQuestion_Quiz_User_Username(Long questionId, Long quizId, String username);

    void deleteAllByQuestion_Id(Long questionId);

    void deleteAllByQuestion_Quiz_Id(Long quizId);

    void deleteByIdAndQuestion_IdAndQuestion_Quiz_Id(Long answerId, Long questionId, Long quizId);

    Optional<Answer> findByIdAndQuestion_IdAndQuestion_Quiz_Id(Long answerId, Long questionId, Long quizId);

}
