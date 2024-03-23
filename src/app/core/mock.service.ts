import {Frame} from "./frame.model";
import {Injectable} from "@angular/core";
import {FlexDirection, FrameType} from "./enums";

@Injectable()
export class MockService {
  generateMockData() {
    const frames: Frame = {
      key: 'canvas',
      frameType: FrameType.FLEX,
      flexLayoutSettings: {
        flexDirection: FlexDirection.column,
        gap: '50'
      },
      children: [
        {
          frameType: FrameType.FLEX,
          flexLayoutSettings: {
            flexDirection: "row",
            gap: '10'
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
            flexDirection: FlexDirection.column,
            gap: '10'
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
      if (frame.key == null) {
        frame.key = parentKey == null ? `0` : `${parentKey}-${index}`;
      }

      if (frame.children.length > 0) {
        this.assingKeys(frame.children, frame.key);
      }
    });

  }
}
