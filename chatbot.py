from flask import jsonify
from langchain import OpenAI, PromptTemplate, LLMChain
import csv
import openai

class ChatBot:
    def __init__(self, api_key_path, response_csv_path):
        # OpenAI API 설정
        self.api_key = self.load_api_key(api_key_path)
        self.model = OpenAI(openai_api_key=self.api_key, model="GPT-4o")
        
        # CSV 파일에서 응답 로드
        self.responses = self.load_response_csv(response_csv_path)

    def load_api_key(self, file_path):
        """API 키를 파일에서 불러옴"""
        with open(file_path, 'r') as file:
            return file.read().strip()

    def load_response_csv(self, csv_file):
        """CSV 파일에서 고민 유형별 응답을 로드"""
        responses = {}
        with open(csv_file, mode="r", encoding="utf-8") as file:
            reader = csv.DictReader(file)
            for row in reader:
                reason = row["유형설명"]  # 고민의 카테고리명
                response = row["대처"]    # 답변
                responses[reason] = response
        return responses

    def process_input(self, user_nick, user_input):
        """사용자 입력을 처리하고 응답을 생성"""
        print(user_nick,user_input)
        template = PromptTemplate(
            template="사용자의 입력은 : '{user_input}'\n고민, 걱정, 또는 문제를 표현하고 있는지? '예', '아니오','맞다'등 명확하고 간결하게 표현",
            input_variables=["user_input"]
        )
        is_problem_chain = LLMChain(llm=self.model, prompt=template)
        try:
            # GPT로 고민 여부 판단
            is_problem_response = is_problem_chain.run(input=user_input).strip()
            pos_res = ["예", "네", "맞다", "맞습니다", "그렇다",
                       "그렇습니다", "고민이라고 판단된다", "고민입니다", "예, 고민이다"]
            
            is_problem_flag = int(is_problem_response in pos_res)

            # 고민이라고 판단한 경우
            if is_problem_flag:
                reason_template = PromptTemplate(
                    template=("입력값은 : '{user_input}'\n"
                              "고민이라고 판단한 이유는?\n"
                              "(예:'LGBT','가족','결혼/육아','금전사업','대인관계','따돌림','성생활','성추행','연애','외모','응원','이별/이혼','일반고민','자아/성격','정신건강','중독/집착','직장','취업/진로','투병/신체','학업/고시')\n예시중에 선택"),         
                    input_variables=["user_input"]
                )
                reason_chain = LLMChain(llm=self.model, prompt=reason_template)
                reason_response = reason_chain.run(input=user_input)
                reason = reason_response.strip()  # 고민 이유는 카테고리명

                # 고민 이유에 맞는 답변 찾기
                if reason in self.responses:
                    answer = self.responses[reason]
                else:
                    answer = self.responses.get("기타", "기본 답변을 제공할 수 없습니다.")

                # 답변 길이 제한
                if len(answer) > 500:
                    answer = answer[:500]  # 500자 이내로 자르기

                return jsonify({
                    "user": user_nick,
                    "input": user_input,
                    "isProblem": is_problem_flag,
                    "reason": reason,
                    "answer": answer
                })
            else:
                # 고민이 아닌 경우 일반적인 GPT 응답
                general_template = PromptTemplate(
                    template="사용자의 입력: '{user_input}'\n 일반적인 답변을 해주세요.",
                    input_variables=["user_input"]
                )
                general_chain = LLMChain(llm=self.model, prompt_template=general_template)
                general_response = general_chain.run(input=user_input)
                answer = general_response.strip()

                # 답변 길이 제한
                if len(answer) > 500:
                    answer = answer[:500]  # 500자 이내로 자르기

                return jsonify({
                    "user_nick": user_nick,
                    "answer": answer
                })
        except Exception as e:
            print("Error processing input:", e)
            return jsonify({"error": "Error processing input"}), 500