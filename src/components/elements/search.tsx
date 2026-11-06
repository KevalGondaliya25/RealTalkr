"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "../ui/command";

type Props = {
  isOpen: boolean;
  close: () => void;
};

const Search = ({ isOpen, close }: Props) => {
  const handleValueChange = (value: string) => {
    console.log(value);
  };
  return (
    <CommandDialog open={isOpen} onOpenChange={close}>
      <CommandInput
        placeholder="Type a command or search..."
        onValueChange={handleValueChange}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
      </CommandList>
    </CommandDialog>
  );
};

export default Search;
