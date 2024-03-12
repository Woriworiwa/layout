import {FlexDirection, FrameType} from "../models/frame.model";
import {Injectable} from "@angular/core";

@Injectable()
export class MockService {
  generateMockData() {
    return {
      key: '0',
      name: 'Desktop',
      frameType: FrameType.FLEX,
      flexLayoutSettings: {
        flexDirection: FlexDirection.ROW
      },
      children: [
        {
          key: '0-0',
          name: '0-0',
          frameType: FrameType.FLEX,
          flexLayoutSettings: {
            flexDirection: FlexDirection.COLUMN
          },
          children:[{
            key: '0-0-1',
            name: '0-0-1',
            frameType: FrameType.FLEX,
            children: []
          },
            {
              key: '0-0-2',
              name: '0-0-2',
              frameType: FrameType.FLEX,
              children: []
            }
          ]
        }, {
          key: '0-1',
          name: '0-1',
          frameType: FrameType.FLEX,
          children: []
        }]
    };
  }
}
