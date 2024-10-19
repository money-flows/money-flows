"use client";

import { Edit, MoreHorizontal, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteTag } from "@/features/tags/api/use-delete-tag";
import { useOpenTag } from "@/features/tags/hooks/use-open-tag";
import { useConfirm } from "@/hooks/use-confirm";

interface ActionsProps {
  id: string;
}

export function Actions({ id }: ActionsProps) {
  const { onOpen } = useOpenTag();

  const deleteMutation = useDeleteTag(id);
  const [ConfirmDialog, confirm] = useConfirm(
    "本当に削除しますか？",
    "この操作は取り消せません。",
  );

  const handleDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate(undefined);
    }
  };

  return (
    <>
      <ConfirmDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled={false} onClick={() => onOpen(id)}>
            <Edit className="mr-2 size-4" />
            編集
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={false}
            onClick={handleDelete}
            className="text-red-500 focus:bg-red-50 focus:text-red-500"
          >
            <Trash className="mr-2 size-4" />
            削除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
