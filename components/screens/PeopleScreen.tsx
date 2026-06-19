"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { MPeople } from "@/components/mobile/MPeople";
import { MPhotobook } from "@/components/mobile/MPhotobook";
import { ResponsiveShell } from "@/components/ResponsiveShell";
import { People } from "@/components/web/People";
import { Photobook } from "@/components/web/Photobook";
import { searchPeople } from "@/lib/data";
import type { Employee, SortKey } from "@/lib/types";

type Book = { list: Employee[]; index: number };

export function PeopleScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("title");
  const [book, setBook] = useState<Book | null>(null);

  const results = useMemo(() => {
    const arr = [...searchPeople(query)];
    if (sort === "az") arr.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "za") arr.sort((a, b) => b.name.localeCompare(a.name));
    else if (sort === "title")
      arr.sort(
        (a, b) => a.title.localeCompare(b.title) || a.name.localeCompare(b.name),
      );
    return arr;
  }, [query, sort]);

  const cycleSort = () =>
    setSort((s) => (s === "az" ? "za" : s === "za" ? "title" : "az"));

  // Clicking a person opens the photobook over the current search results, looping.
  const openBook = (emp: Employee) => {
    const list = results;
    const index = Math.max(0, list.findIndex((e) => e.id === emp.id));
    setBook({ list, index });
  };
  const closeBook = () => setBook(null);
  const nextPerson = () =>
    setBook((b) => (b ? { ...b, index: (b.index + 1) % b.list.length } : b));
  const prevPerson = () =>
    setBook((b) =>
      b ? { ...b, index: (b.index - 1 + b.list.length) % b.list.length } : b,
    );

  const toDepartments = () => router.push("/departments");
  const signOut = () => router.push("/");

  return (
    <ResponsiveShell
      web={
        <>
          <People
            query={query}
            setQuery={setQuery}
            sort={sort}
            onCycleSort={cycleSort}
            results={results}
            onBack={toDepartments}
            onSignOut={signOut}
            onSelect={openBook}
          />
          {book && (
            <Photobook
              list={book.list}
              index={book.index}
              onNext={nextPerson}
              onPrev={prevPerson}
              onClose={closeBook}
            />
          )}
        </>
      }
      mobile={
        <>
          <MPeople
            query={query}
            setQuery={setQuery}
            sort={sort}
            onCycleSort={cycleSort}
            results={results}
            onBack={toDepartments}
            onSignOut={signOut}
            onSelect={openBook}
          />
          {book && (
            <MPhotobook
              list={book.list}
              index={book.index}
              onNext={nextPerson}
              onPrev={prevPerson}
              onClose={closeBook}
            />
          )}
        </>
      }
    />
  );
}
