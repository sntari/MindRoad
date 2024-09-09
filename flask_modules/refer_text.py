import pandas as pd
import numpy as np
from transformers import AutoTokenizer, AutoModel
import torch
from sklearn.metrics.pairwise import cosine_similarity


class ResponseSearch:
    def __init__(self,csv_file_path,model_name):
        self.csv_file_path = csv_file_path
        self.data = self._load_data()
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModel.from_pretrained(model_name)


    def _load_data(self):
        data = pd.read_csv(self.csv_file_path,encoding="utf-8")
        self.data = data
        self.preprocess_embedding()
        return self.data
    
    def preprocess_embedding(self):
        #백터값 numpy로 변환 함수
        def str_to_vector(embedding_str):
            return np.fromstring(embedding_str, sep=",")
        #대처_임베딩의 백터값을 numpy화 : 코사인유사도 비교를 위함.
        self.data["대처_임베딩"] = self.data["대처_임베딩_백터"].apply(str_to_vector)


    # 사용자의 질문 임베딩    
    def embed_text(self,text):
        inputs = self.tokenizer(text,return_tensors="pt",truncation=True,padding=True)
        with torch.no_grad():
            outputs = self.model(**inputs)
        embedding = outputs.last_hidden_state.mean(dim=1).squeeze().numpy()
        return embedding

    #특정 고민유형의 임베딩 데이터 불러오기
    def get_cate_embed(self,reason):
        cate_data = self.data[self.data["유형설명"]== reason]
        #고민 유형별로 수많은 row를 numpy형식으로 한줄로 변경
        return cate_data
    
    #가장 적합한 답변 찾는 방법
    def find_best_ans(self,user_input,reason):
        # 사용자 질문 embedding(768,)형태 (1,768)로 변경
        user_emd = self.embed_text(user_input).reshape(1,-1)

        #특정 고민유형의 임베딩데이터 로드
        cate_data = self.get_cate_embed(reason)

        #특정 고민유형의 대처임베딩값 vstack을 통해 정렬
        y = np.vstack(cate_data["대처_임베딩"].values)

        # 유사도 계산
        cos_sim = cosine_similarity(user_emd,y)
        bs_idx = cos_sim.argmax()

        # 가장 유사도 높은 답변데이터
        most_sim_entry = cate_data["대처"].iloc[bs_idx].strip()
        
        return most_sim_entry