from openai import OpenAI
import csv
from langchain_core.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_openai import ChatOpenAI
from langchain.memory import ConversationBufferMemory



class ChatBot:
    def __init__(self, api_key, response_search):
        self.client = OpenAI(api_key=api_key)
        self.model = ChatOpenAI(temperature=0.7, model_name="gpt-4", openai_api_key=api_key)
        self.responses_search = response_search
        self.memory = ConversationBufferMemory()

    def is_problem(self, user_input):
        """고민 여부 판단"""
        template = PromptTemplate(
            template="사용자의 입력은 : '{user_input}'\n고민, 걱정, 또는 문제를 표현하고 있는지? '예', '아니오','맞다'등 명확하고 간결하게 표현",
            input_variables=["user_input"]
        )
        ck_chain = LLMChain(llm=self.model, prompt=template)
        response = ck_chain.run(user_input=user_input).strip()
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

                #고민 이유에 맞는 답변 찾기
                reference_data = self.responses_search.find_best_ans(user_input,reason)
                print(f"reference : {reference_data}")

                rag_template = PromptTemplate(
                    template=
                        "사용자 입력: '{user_input}'\n"
                        "데이터 : '{reference_data}'\n"
                        "{reference_data}와 유사하게 {user_input}에 맞는 답변을 단락을 나누어 최대 500자 이내로 출력을 해주세요.",
                        input_variables=["reference_data","user_input"]
                )
                rag_chain = LLMChain(llm=self.model,prompt=rag_template)
                rag_response = rag_chain.run(user_input=user_input,reference_data=reference_data)

                answer = rag_response.strip()

                
                return {
                    "user" : user_nick,
                    "input" : user_input,
                    "isProblem" : True,
                    "reason" : reason,
                    "answer" : answer

                }


            else:
                # 이전 대화를 기억하면서 대화를 이어나감.
                response = self.memory.load_memory_variables({})
                response.update({
                    "role":"user","content":user_input
                })
                gen_chain = LLMChain(llm=self.model,prompt=PromptTemplate(
                    template= "사용자과 AI어시스턴트간의 대화 입니다. AI는 이전 대화를 기억하며,따뜻한말투로 대화합니다.\n\n"
                    "{history}\n\n사용자:{user_input}\nAI(따뜻한말투):",
                    input_variables=["history","user_input"]
                    ),
                    memory = self.memory
                    )
                answer = gen_chain.run(user_input=user_input)

                return {
                    "user" : user_nick,
                    "input" : user_input,
                    "isProblem" : False,
                    "answer" : answer
                }

                
        except Exception as e:
            print("Error processing input:", e)
            return {"error": f"Error processing input: {str(e)}"}
        

# API 키를 파일에서 읽어오기
def load_api_key(file_path='C:\\Users\\SMHRD\\Desktop\\ky_api.txt'):
    try:
        with open(file_path, 'r') as file:
            return file.read().strip()
    except FileNotFoundError:
        print(f"Error: {file_path} not found.")
        return None
    except Exception as e:
        print(f"Error reading API key: {str(e)}")
        return None