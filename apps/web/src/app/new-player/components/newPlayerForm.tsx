"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EmojiPicker from "emoji-picker-react";
import { useToast } from "@/components/ui/use-toast";
import addPlayer from "../actions/addPlayer";

export default function NewPlayerForm() {
  const { pending } = useFormStatus();

  const [emoji, setEmoji] = useState("");
  const [name, setName] = useState("");

  const { toast } = useToast();

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("emoji", emoji);

    addPlayer(formData).catch((error) => {
      toast({
        title: "Fehler!",
        description: `${error}`,
        variant: "destructive",
      });
    });
  };

  const buttonDisabled = !name || !emoji;
  return (
    <form
      onSubmit={onFormSubmit}
      className="flex flex-col justify-between mt-8 w-full h-full max-w-xl max-h-64  space-y-2"
    >
      <Label htmlFor="name">Name</Label>
      <Input
        type="text"
        name="name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Label>Emoji</Label>
      <div className="flex justify-center">
        <EmojiPicker
          previewConfig={{
            defaultCaption: name
              ? `Wähle ein passendes Emoji für ${name}`
              : "Wähle ein passendes Emoji für den neuen Spieler",
          }}
          searchDisabled
          width="100%"
          onEmojiClick={(emojiData) => setEmoji(emojiData.emoji)}
        />
      </div>
      <Button type="submit" disabled={buttonDisabled} className="mt-12">
        {pending ? (
          <>lade...</>
        ) : (
          !!name &&
          !!emoji && (
            <>
              &quot;{name} {emoji}&quot; hinzufügen
            </>
          )
        )}
      </Button>
      {buttonDisabled && (
        <p className="text-red-500">Bitte fülle alle Felder aus</p>
      )}
    </form>
  );
}
