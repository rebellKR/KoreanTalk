# 문제 생성 공통 함수: 보기 섞기, id 부여, 검사, 저장
import json, os, random
ROOT=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
class Batch:
    def __init__(self, tag, seed):
        self.tag, self.seed, self.Q = tag, seed, []
    def add(self, level, section, items, question=None):
        for it in items:
            if question: self.Q.append((level, section, question, it[1], it[2], it[0]))
            else: self.Q.append((level, section, it[0], it[1], it[2], it[3] if len(it) > 3 else None))
    def save(self):
        rng=random.Random(self.seed); cnt={}; out=[]
        for level,section,q,choices,exp,passage in self.Q:
            assert len(choices)==4 and len(set(choices))==4, q
            key=f"{level}-{section}"; cnt[key]=cnt.get(key,0)+1
            order=list(range(4)); rng.shuffle(order)
            item={"id":f"{self.tag}{level}-{section}-{cnt[key]:03d}","level":level,"section":section,"question":q,
                  "choices":[choices[i] for i in order],"answer":order.index(0),"explanationJa":exp}
            if passage: item["passage"]=passage
            out.append(item)
        path=os.path.join(ROOT,"src/data",f"topik{self.tag[1:]}.json")
        json.dump(out,open(path,"w",encoding="utf-8"),ensure_ascii=False,indent=1)
        print(os.path.basename(path),len(out),cnt)
