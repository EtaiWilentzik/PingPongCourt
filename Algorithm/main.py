from ultralytics import YOLO


if __name__ == '__main__':
    # Load a model
    model = YOLO("yolov8n.yaml")  # build a new model from scratch
    # hello from adi
    # model = YOLO('yolov8n.yaml').load('yolov8n.pt')  # build from YAML and transfer weights

# this is the good code
# model = YOLO('yolov8n.pt')
#
# # Use the model batch=-1 best results
    model.train(data="config.yaml", epochs=1)  # train the model

model = YOLO('last.pt')
train_results = model.train(data='config.yaml', epochs=100, imgsz=864)
