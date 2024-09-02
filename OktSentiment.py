import csv
from konlpy.tag import Okt

okt = Okt()

# KOSAC 사전 파일 로드 및 감정 분석 클래스 정의
class Sentiment:
    def __init__(self):
        self._load_dic()
        
    # KOSAC 사전 파일 로드
    def _load_dic(self):
        self._polarity = self._load_kosac('./dic/polarity.csv')

    # CSV 파일에서 KOSAC 사전 데이터를 로드
    def _load_kosac(self, file_path):
        data = {}
        with open(file_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.reader(csvfile)
            header = next(reader)  # Read the header row
            for row in reader:
                ngram = row[0]
                ngram_split = ngram.split(';')
                data_entry = {header[i]: row[i] for i in range(2, len(header) - 2)}  # Skip 'ngram' and 'freq'
                self._set_nested_dict(data, ngram_split, data_entry)
        return data

    # 중첩 딕셔너리를 설정하는 헬퍼 메소드
    def _set_nested_dict(self, dictionary, keys, value):
        for key in keys[:-1]:
            if key not in dictionary:
                dictionary[key] = {}
            dictionary = dictionary[key]
        dictionary[keys[-1]] = value

    # 형태소 분석 함수
    def parseData(self, data):
        return self.parseOkt(data)

    def parseOkt(self, data):
        if isinstance(data, str):
            try:
                result = okt.pos(data)
                return result
            except UnicodeDecodeError as e:
                print(f"Error decoding string: {e}")
                return []
        elif isinstance(data, list):
            return [self.parseOkt(doc) for doc in data]
        return data

    # 형태소 분석 결과를 정렬
    def _convert_pos_tag(self, tag):
        tag_mapping = {
            'Noun': 'NNG',
            'Verb': 'VV',
            'Adjective': 'VA',
            'Adverb': 'MAG',
            'Josa': 'JKS',
            'Eomi': 'EF',
            'Punctuation': 'SF',
            'KoreanParticle': 'VCP',
            'Determiner': 'MM',
            'Exclamation': 'IC',
            'Alpha': 'SL',
            'Number': 'SN',
            'Foreign': 'SL',
            'Unknown': 'NA',
            'Modifier': 'MM',
            'Suffix': 'XSN',
            'PreEomi': 'EP',
            'Conjunction': 'MAJ',
        }
        return tag_mapping.get(tag, tag)

    def align_morpheme(self, morpheme):
        aligned = [f"{elem[0]}/{self._convert_pos_tag(elem[1])}" for elem in morpheme]
        # print(f"정렬된 형태소 분석 결과: {aligned}")  # 정렬된 형태소 분석 결과 출력
        return aligned

    # 감정 분석 계산을 수행
    def calc(self, key_pairs, source, target, func):
        for source_key, target_key in key_pairs:
            source_data = source.get(source_key)
            if source_data is not None:
                if isinstance(source_data, str):
                    source_data = float(source_data)
                if isinstance(source_data, (int, float)):
                    target[target_key] = func(source_data, target.get(target_key, 0))

    # 퍼센티지로 변환하는 메소드
    def percentage(self, obj):
        keys = list(obj.keys())
        values = list(obj.values())
        total = sum(values)
        if total == 0:
            return dict.fromkeys(keys, 0)  # total이 0인 경우 모든 값을 0으로 설정
        percentages = [value / total for value in values]
        return dict(zip(keys, percentages))

    # 형태소와 감정 사전을 매칭하여 분석
    def match(self, data, pair_data, key_pairs):
        ret = {key_pair[1]: 0 for key_pair in key_pairs}
        for m in data:
            current_data = pair_data.get(m, {})
            self.calc(key_pairs, current_data, ret, lambda s, t: t + s)
        return self.percentage(ret) if sum(ret.values()) > 0 else dict.fromkeys(ret, 0)

    # 각각 극성, 강도, 표현 유형에 대한 분석을 수행
    def polarity(self, data):
        return self.match(data, self._polarity, [
            ['COMP', '비교'],
            ['POS', '긍정'],
            ['NEG', '부정'],
            ['NEUT', '중립'],
            ['None', '없음']
        ])

    # 주어진 데이터셋에 대해 전체 감정 분석을 수행
    def analyze(self, dataset):
        if not isinstance(dataset, list):
            raise ValueError('The dataset has to be array type.')
        ret = {}
        for data in dataset:
            for type_name in ['polarity']:
                if type_name not in ret:
                    ret[type_name] = []
                ret[type_name].append(getattr(self, type_name)(data))
        return ret

    # 형태소 분석과 감정 분석을 연결하여 전체 과정을 수행
    def parse(self, dataset):
        morpheme_results = self.parseData(dataset)
        aligned_results = [self.align_morpheme(result) for result in morpheme_results]
        return self.analyze(aligned_results)
