import {
  ChangeDetectionStrategy,
  Component,
  output,
  input,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EditableContentDirective} from "../text/editable-content.directive";
import {TextComponent} from "../text/text.component";
import {AiWrapperComponent} from "../ai-wrapper/ai-wrapper.component";
import {CanvasItemType} from '../../../core/enums';
import {CanvasItemBaseComponent} from "../canvas-item-base.component";
import {CanvasItemMouseEvent} from "../canvas-item-mouse-event";
import {AssetDropDirective} from "../../drag-drop/asset-drop.directive";

@Component({
  selector: 'app-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    EditableContentDirective,
    TextComponent,
    AiWrapperComponent,
  ],
  templateUrl: 'container.component.html',
  hostDirectives: [
    {
      directive: AssetDropDirective,
      inputs: ['appAssetDrop'],
    },
  ],
  host: {
    /*without tab index, the keydown listeners will not fire because the element is not focusable. Adding tabindex makes it focusable*/
    '[attr.tabindex]': '-1',
  },
  styleUrls: ['./container.component.scss'],
})
export class ContainerComponent extends CanvasItemBaseComponent {
  selectedFrameKey = input<string | undefined>(undefined);
  childTextContentChanged = output<{ key: string; content: string }>();

  protected readonly FrameType = CanvasItemType;

  protected onChildFrameClick(event: CanvasItemMouseEvent) {
    this.clicked.emit(event);
  }

  onChildMouseOver(event: CanvasItemMouseEvent) {
    this.mouseOver.emit(event);
  }

  onChildMouseOut(event: CanvasItemMouseEvent) {
    this.mouseOut.emit(event);
  }

  onChildContextMenu(event: CanvasItemMouseEvent) {
    this.contextMenu.emit(event);
  }

  protected onChildTextContentChanged({
    key,
    content,
  }: {
    key: string;
    content: string;
  }) {
    this.childTextContentChanged.emit({ key, content });
  }
}
