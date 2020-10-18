package com.fax.quizcreatorbackend.repositories;

import com.fax.quizcreatorbackend.entities.Quiz;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface QuizRepository extends CrudRepository<Quiz, Long> {
    @Override
    List<Quiz> findAll();

    List<Quiz> findAllByUser_Username(String username);
}
