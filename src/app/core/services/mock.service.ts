import {FlexDirection, Frame, FrameType} from "../models/frame.model";
import {Injectable} from "@angular/core";

@Injectable()
export class MockService {
  generateMockData() {
    const frames: Frame = {
      frameType: FrameType.FLEX,
      flexLayoutSettings: {
        flexDirection: FlexDirection.COLUMN,
        gap: 50
      },
      children: [
        {
          frameType: FrameType.FLEX,
          flexLayoutSettings: {
            flexDirection: FlexDirection.ROW,
            gap: 10
          },
          children:[{
            name: 'lorem ipsum',
            frameType: FrameType.TEXT,
            children: []
          },
            {
              name: 'lorem ipsum gaga gugu gigi',
              frameType: FrameType.TEXT,
              children: []
            },
            {
              name: 'lorem ipsum gaga gugu gigi',
              frameType: FrameType.TEXT,
              children: []
            },
            {
              name: 'lorem ipsum gaga gugu gigi',
              frameType: FrameType.TEXT,
              children: []
            },
            {
              name: 'lorem ipsum gaga gugu gigi',
              frameType: FrameType.TEXT,
              children: []
            },
            {
              name: 'lorem ipsum gaga gugu gigi',
              frameType: FrameType.TEXT,
              children: []
            }
          ]
        }, {
          frameType: FrameType.FLEX,
          flexLayoutSettings: {
            flexDirection: FlexDirection.COLUMN,
            gap: 10
          },
          children:[{
            name: 'lorem ipsum',
            frameType: FrameType.TEXT,
            children: []
          },
            {
              name: 'lorem ipsum',
              frameType: FrameType.TEXT,
              children: []
            },
            {
              name: 'lorem ipsum',
              frameType: FrameType.TEXT,
              children: []
            },
            {
              name: 'lorem ipsum',
              frameType: FrameType.TEXT,
              children: []
            }
          ]
        }]
    };

    this.assingKeys([frames], undefined)

    return frames;
  }

  private assingKeys(frames: Frame[], parentKey: string | undefined) {
    frames.forEach((frame, index) => {
      frame.key = parentKey == null ? `0` : `${parentKey}-${index}`;
      if (frame.children.length > 0) {
        this.assingKeys(frame.children, frame.key);
      }
    });

  }
}
