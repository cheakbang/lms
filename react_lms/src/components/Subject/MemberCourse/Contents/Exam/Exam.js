import styled from "styled-components";
import { NavLink } from "react-router-dom";

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const QuestWrap = styled.div`
  width: 500px;
  margin-top: 30px;
  background-color: #f7f7f7;
  border-radius: 10px;
  padding: 20px;
`;

const QuestTitle = styled.div`
  background-color: lightblue;
  font-size: 20px;
  font-weight: bold;
  padding: 10px;
  border-radius: 8px;
`;

const QuestBox = styled.div`
  margin-top: 20px;
`;

const OptionBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const SingleOption = styled.div`
  background-color: white;
  border-radius: 8px;
  border: 2px solid gray;
  padding: 10px;
  margin: 8px 0;
  cursor: pointer;
  &:hover {
    border: 2px solid lightgreen;
  }
`;

const SubmitButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #45a049;
  }
`;

export function Exam() {
  return (
    <Container>
      <QuestWrap>
        <QuestTitle>
          <div>questionText</div>
          <div>questParagraph: 이게 뭔지 몰라서......</div>
        </QuestTitle>
        <QuestBox>
          <OptionBox>
            <SingleOption>options</SingleOption>
            <SingleOption>options</SingleOption>
            <SingleOption>options</SingleOption>
            <SingleOption>options</SingleOption>
          </OptionBox>
        </QuestBox>
        <SubmitButton>과제 제출</SubmitButton>
      </QuestWrap>
    </Container>
  );
}
