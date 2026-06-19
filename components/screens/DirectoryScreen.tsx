"use client";

import {
  notFound,
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useMemo, useState } from "react";
import { MDirectory } from "@/components/mobile/MDirectory";
import { MPhotobook } from "@/components/mobile/MPhotobook";
import { ResponsiveShell } from "@/components/ResponsiveShell";
import { Directory } from "@/components/web/Directory";
import { Photobook } from "@/components/web/Photobook";
import {
  companyName,
  companyOfDept,
  filterPeople,
  isDeptKey,
} from "@/lib/data";
import type { Employee, SortKey } from "@/lib/types";

type Book = { list: Employee[]; index: number };

export function DirectoryScreen() {
  const router = useRouter();
  const params = useParams<{ dept: string }>();
  const searchParams = useSearchParams();
  const dept = params.dept;
  if (!isDeptKey(dept)) notFound();

  const [section, setSection] = useState<string>(
    searchParams.get("section") ?? "all",
  );
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("title");
  const [book, setBook] = useState<Book | null>(null);

  const results = useMemo(() => {
    const base = filterPeople(dept, section, query);
    const arr = [...base];
    if (sort === "az") arr.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "za") arr.sort((a, b) => b.name.localeCompare(a.name));
    else if (sort === "title")
      arr.sort(
        (a, b) => a.title.localeCompare(b.title) || a.name.localeCompare(b.name),
      );
    return arr;
  }, [dept, section, query, sort]);

  const cycleSort = () =>
    setSort((s) => (s === "az" ? "za" : s === "za" ? "title" : "az"));

  // The photobook pages through exactly what's on screen — the current
  // section/search filter, in the sort order the user chose.
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

  // Directory is reached from a company's org page — go back there.
  const company = companyOfDept(dept);
  const backLabel = company ? companyName(company) : "Sections";
  const toSections = () =>
    router.push(company ? `/company/${company}` : `/sections/${dept}`);
  const signOut = () => router.push("/");

  return (
    <ResponsiveShell
      web={
        <>
          <Directory
            dept={dept}
            section={section}
            setSection={setSection}
            query={query}
            setQuery={setQuery}
            sort={sort}
            onCycleSort={cycleSort}
            results={results}
            onBack={toSections}
            backLabel={backLabel}
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
          <MDirectory
            dept={dept}
            section={section}
            setSection={setSection}
            query={query}
            setQuery={setQuery}
            sort={sort}
            onCycleSort={cycleSort}
            results={results}
            onBack={toSections}
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
