import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";

const rootPath = "src/content";

const readFile = (filePath: string) => {
    return fs.readFileSync(filePath, "utf-8");
};

const parseFrontmatter = (frontmatter: any) => {
    const frontmatterString = JSON.stringify(frontmatter);
    return JSON.parse(frontmatterString);
};

export const getMainPage = (filePath: string) => {
    const pageDataPath = path.join(rootPath, filePath);

    if (!fs.existsSync(pageDataPath)) {
        notFound();
    }

    const pageData = readFile(pageDataPath);
    const { content, data: frontmatter } = matter(pageData);

    return {
        data: parseFrontmatter(frontmatter),
        content,
    };
};

export const getAllPages = (folder: string) => {
    const folderPath = path.join(rootPath, folder);

    if (!fs.existsSync(folderPath) || !fs.lstatSync(folderPath).isDirectory()) {
        notFound();
    }

    const filesPath = fs.readdirSync(folderPath);
    const sanitizeFiles = filesPath.filter((file) => file.endsWith(".mdx"));
    const filterSingleFiles = sanitizeFiles.filter((file) =>
        file.match(/^(?!_)/)
    );

    const singlePages = filterSingleFiles.map((filename) => {
        const slug = filename.replace(".mdx", "");
        const filePath = path.join(folderPath, filename);
        const pageData = readFile(filePath);
        const { content, data: frontmatter } = matter(pageData);
        const url = frontmatter.url ? frontmatter.url.replace("/", "") : slug;

        return {
            data: parseFrontmatter(frontmatter),
            slug: url,
            content,
        };
    });

    const publishedPages = singlePages.filter(
        (page) => !page.data.draft && page
    );
    const dateFilter = publishedPages.filter(
        (page) => new Date(page.data.date || new Date()) <= new Date()
    );

    const filterByDate = dateFilter.sort(
        (page, page2) =>
            new Date(page2.data.date || new Date()).getTime() -
            new Date(page.data.date || new Date()).getTime()
    );

    return filterByDate;
};
