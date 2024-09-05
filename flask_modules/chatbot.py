from openai import OpenAI
import csv
from langchain import PromptTemplate, LLMChain
from langchain.chat_models import ChatOpenAI

class ChatBot:
    def __init__(self, api_key, csv_file):
        self.client = OpenAI(api_key=api_key)
        self.model = ChatOpenAI(temperature=0.7, model_name="gpt-4", openai_api_key=api_key)
        self.responses = self.load_response_csv(csv_file)

    def load_response_csv(self, csv_file):
        """CSV 파일에서 고민 유형별 응답을 로드"""
        responses = {}
        with open(csv_file, mode="r", encoding="utf-8") as file:
            reader = csv.DictReader(file)
            for row in reader:
                reason = row["유형설명"].strip()  # 공백 제거
                response = row["대처"].strip()    # 공백 제거
                responses[reason] = response
        return responses

    def is_problem(self, user_input):
        """고민 여부 판단"""
        template = PromptTemplate(
            template="사용자의 입력은 : '{user_input}'\n고민, 걱정, 또는 문제를 표현하고 있는지? '예', '아니오','맞다'등 명확하고 간결하게 표현",
            input_variables=["user_input"]
        )
        chain = LLMChain(llm=self.model, prompt=template)
        response = chain.run(user_input=user_input).strip()
        pos_res = ["예", "네", "맞다", "맞습니다", "그렇다",
                   "그렇습니다", "고민이라고 판단된다", "고민입니다", "예, 고민이다"]
        return response in pos_res

    def get_problem_reason(self, user_input):
        """고민 이유 판단"""
        reason_template = PromptTemplate(
            template=("입력값은 : '{user_input}'\n"
                      "고민이라고 판단한 이유는?\n"
                      "(예:'가족','결혼/육아','금전사업','대인관계','따돌림','성생활','성추행','연애','외모','응원','이별/이혼','일반고민','자아/성격','정신건강','중독/집착','직장','취업/진로','투병/신체','학업/고시')\n"
                      "위의 예시 중에서 하나만 선택하여 답변하세요."),
            input_variables=["user_input"]
        )
        reason_chain = LLMChain(llm=self.model, prompt=reason_template)
        reason = reason_chain.run(user_input=user_input).strip()
            # 제거할 따옴표
        if reason.startswith("''") and reason.endswith("''"):
            reason = reason[2:-2]
        elif reason.startswith("'") and reason.endswith("'"):
            reason = reason[1:-1]

        print(f"Extracted reason: '{reason}'")
        return reason

    
    def process_input(self, user_nick, user_input):
        """사용자 입력을 처리하고 응답을 생성"""
        print(f"Processing input: user_nick={user_nick}, user_input={user_input}")
        try:
            # 고민 여부 판단
            is_problem_flag = self.is_problem(user_input)
            print(f"Is problem flag: {is_problem_flag}")

            if is_problem_flag:
                print("고민임")
                reason = self.get_problem_reason(user_input).strip()
                print(f"Problem reason: {reason}")

                # 고민 이유에 맞는 답변 찾기
                if reason in self.responses:
                    response = self.client.chat.completions.create(
                    model="gpt-4",
                    messages=[
                        {"role": "system", "content": f"사용자의 고민에 대해 공감하고 해결방안을 제시하는 상담사입니다. 참고할 답변은 {self.responses[reason]}이고 다음 형식으로 응답해주세요:\n\n고민이유 : [고민의 근본적인 이유 설명]\n\n해결방안:\n\n1. [첫 번째 해결방안]\n\n2. [두 번째 해결방안]\n\n3. [세 번째 해결방안]"},
                        {"role": "user", "content": f"다음은 사용자의 고민입니다: {user_input}\n\n이 고민의 유형은 '{reason}'입니다. 이에 대한 고민이유와 해결방안을 제시해주세요."}
                        ]
                    )
                    answer = response.choices[0].message.content.strip()
                else:
                    answer = self.responses.get("기타", "죄송합니다. 해당 고민에 대한 특정 답변을 찾을 수 없습니다. 하지만 귀하의 고민을 듣고 있으며, 힘든 상황을 이해합니다. 필요하다면 전문가와 상담을 받아보는 것도 좋은 방법일 수 있습니다.")

                # 답변 길이 제한
                if len(answer) > 500:
                    answer = answer[:500] + "..."  # 500자 이내로 자르기

                return {
                    "user": user_nick,
                    "input": user_input,
                    "isProblem": True,
                    "reason": reason,
                    "answer": answer,
                }
            else:
                print("고민이 아님")
                response = self.client.chat.completions.create(
                    model="gpt-4",
                    messages=[
                        {"role": "system", "content": "You are a helpful assistant."},
                        {"role": "user", "content": user_input}
                    ]
                )
                answer = response.choices[0].message.content.strip()

                # 답변 길이 제한
                if len(answer) > 500:
                    answer = answer[:500] + "..."  # 500자 이내로 자르기

                return {
                    "user_nick": user_nick,
                    "answer": answer
                }
        except Exception as e:
            print("Error processing input:", e)
            return {"error": f"Error processing input: {str(e)}"}
# API 키를 파일에서 읽어오기
def load_api_key(file_path='c:/Users/SMHRD/api.txt'):
    try:
        with open(file_path, 'r') as file:
            return file.read().strip()
    except FileNotFoundError:
        print(f"Error: {file_path} not found.")
        return None
    except Exception as e:
        print(f"Error reading API key: {str(e)}")
        return None
