from flask import Flask, request, jsonify
from langchain_core.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_openai import ChatOpenAI

class TarotBot:
    def __init__(self, api_key_path):
        #OpenAI API 설정
        self.api_key = self.load_api_key(api_key_path)
        self.model = ChatOpenAI(openai_api_key = self.api_key, model="gpt-4o")

    def load_api_key(self, file_path):
        with open(file_path, 'r') as file:
            api_key = file.read().strip()
            return api_key
        
    # 사용자 고민이 있을때 타로 해석
    def interpret_cards(self, user_input, cards):
        try:
            tarot_template_reason = PromptTemplate(
                template=(
                    "사용자의 질문: '{user_input}'\n"
                    "타로카드: {cards}\n"
                    "{cards}의 의미는 한줄로 간략히 출력하고, {user_input}를 주제로 종합한 해석은 최대 500자 이내로 출력해주세요."
                ),
                input_variables=[ "cards","user_input"]
            )

            reason_chain = LLMChain(llm=self.model, prompt=tarot_template_reason)
            reason_response = reason_chain.run(user_input=user_input, cards=cards)
            answer = reason_response.strip()
    

            return jsonify({"answer": answer})

        except Exception as e:
            return f"Error in interpret_cards: {str(e)}"
        
    # 일반적인 타로 해석
    def general_reading(self, user_select, cards):
        cards_str = ", ".join(cards)
        try:
            tarot_template_genal = PromptTemplate(
                template=(
                    "사용자 선택 카테고리: '{user_select}'\n"
                    "타로카드: {cards}\n"
                    "{cards}의 의미는 한줄로 간략히 출력하고, {user_select}를 주제로 종합한 해석은 최대 500자 이내로 출력해주세요.\n"
                ),
                input_variables=["user_select", "cards"]
            )

            general_chain = LLMChain(llm=self.model, prompt=tarot_template_genal)
            general_response = general_chain.invoke({"user_select":user_select,"cards":cards_str})
            
            if isinstance(general_response, str):
                answer = general_response.strip()
            else:
                answer = general_response
            
            if len(answer) > 500:
                answer = answer[:500]

            return jsonify({"answer": answer})

        except Exception as e:
            print((f"Error: {e}"))
            return "일반 해석 중 오류가 발생했습니다."