"use client";

import { useProjectStore } from "@/stores/project-store";
import { useAspectRatio } from "@/hooks/use-aspect-ratio";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import { useTimelineStore } from "@/stores/timeline-store";
import { Textarea } from "../ui/textarea";
import { MediaElement, TextElement } from "@/types/timeline";
import { useMediaStore } from "@/stores/media-store";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../ui/select";
import { FONT_OPTIONS, type FontFamily } from "@/constants/font-constants";

export function PropertiesPanel() {
  const { activeProject } = useProjectStore();
  const { getDisplayName, canvasSize } = useAspectRatio();
  const { selectedElements, tracks, updateTextElement } = useTimelineStore();
  const { mediaItems } = useMediaStore();

  const emptyView = (
    <div className="space-y-4 p-5">
      {/* Media Properties */}
      <div className="flex flex-col gap-3">
        <PropertyItem label="Name:" value={activeProject?.name || ""} />
        <PropertyItem label="Aspect ratio:" value={getDisplayName()} />
        <PropertyItem
          label="Resolution:"
          value={`${canvasSize.width} × ${canvasSize.height}`}
        />
        <PropertyItem label="Frame rate:" value="30.00fps" />
      </div>
    </div>
  );

  const TextProperties = (element: TextElement, trackId: string) => (
    <div className="space-y-6 p-5">
      <Textarea
        placeholder="Name"
        defaultValue={element.content}
        className="min-h-[4.5rem] resize-none"
        onChange={(e) =>
          updateTextElement(trackId, element.id, { content: e.target.value })
        }
      />
      <div className="flex items-center justify-between gap-6">
        <Label className="text-xs">Font</Label>
        <Select
          defaultValue={element.fontFamily}
          onValueChange={(value: FontFamily) =>
            updateTextElement(trackId, element.id, { fontFamily: value })
          }
        >
          <SelectTrigger className="w-full text-xs">
            <SelectValue placeholder="Select a font" />
          </SelectTrigger>
          <SelectContent>
            {FONT_OPTIONS.map((font) => (
              <SelectItem key={font.value} value={font.value}>
                {font.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const MediaProperties = (element: MediaElement) => {
    const mediaItem = mediaItems.find((item) => item.id === element.mediaId);

    if (mediaItem?.type === "audio") {
      return <div className="space-y-4 p-5">Audio properties</div>;
    }

    // video or image
    return <div className="space-y-4 p-5">Video/Image properties</div>;
  };

  const ElementProperties = (
    <>
      {selectedElements.map(({ trackId, elementId }) => {
        const track = tracks.find((t) => t.id === trackId);
        const element = track?.elements.find((e) => e.id === elementId);

        if (element?.type === "text") {
          return <div key={elementId}>{TextProperties(element, trackId)}</div>;
        }
        if (element?.type === "media") {
          return <div key={elementId}>{MediaProperties(element)}</div>;
        }
      })}
    </>
  );

  return (
    <ScrollArea className="h-full bg-panel rounded-sm">
      {selectedElements.length > 0 ? ElementProperties : emptyView}
    </ScrollArea>
  );
}

function PropertyItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <span className="text-xs text-right">{value}</span>
    </div>
  );
}
