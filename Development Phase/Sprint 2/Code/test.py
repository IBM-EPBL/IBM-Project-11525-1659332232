import json
import pickle
import numpy as np
import sklearn as sk
import sys

if __name__ == "__main__":
    # args = [70, 1, 4, 130, 322, 0, 2, 109, 0, 2.4, 2, 3, 3, ]
    # print(sys.argv[1])
    mlModel = None
    # print("hii")

    with open("D:/IBM/IBM-APP/server/controllers/model.pickle", 'rb') as f:
        mlModel = pickle.load(f)

    x = np.zeros(13)
    for i in range(0, 13):
        x[i] = float(sys.argv[i+1])
        # x[i] = float(args[i])
        if i != 9:
            x[i] = int(x[i])
    # print(mlModel)
    tes = mlModel.predict([x])[0]

    print(tes)
