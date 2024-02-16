import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../AuthContext";
import { apiGetCourse } from "../../RestApi";

export function UserCourseDescription() {
  const { user } = useContext(AuthContext);
  const { courseId } = useParams();
  const [course, setCourse] = useState([]);

  // courseId로 course 조회
  useEffect(() => {
    apiGetCourse(courseId)
      .then((response) => {
        setCourse(response.data.data);
      })
      .catch((error) => {
        console.error("강의 정보 불러오기 오류: ", error);
      });
  }, [courseId]);

  return (
    <>
      <h1>강의 소개</h1>
      <p>{course.description}</p>
    </>
  );
}
