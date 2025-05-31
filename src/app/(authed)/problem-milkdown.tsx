"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSidebar } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { defaultKeymap } from "@codemirror/commands";
import { languages } from "@codemirror/language-data";
import { oneDark } from "@codemirror/theme-one-dark";
import { keymap } from "@codemirror/view";
import { Crepe } from "@milkdown/crepe";
import { codeBlockComponent, codeBlockConfig } from "@milkdown/kit/component/code-block";
import { imageBlockComponent } from "@milkdown/kit/component/image-block";
import {
	configureLinkTooltip,
	linkTooltipAPI,
	linkTooltipPlugin,
	linkTooltipState,
} from "@milkdown/kit/component/link-tooltip";
import { defaultValueCtx, Editor, editorViewCtx, rootCtx } from "@milkdown/kit/core";
import { Ctx } from "@milkdown/kit/ctx";
import { commonmark, linkSchema } from "@milkdown/kit/preset/commonmark";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { nord } from "@milkdown/theme-nord";
import { basicSetup } from "codemirror";
import { Check, Save } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";

// import '@milkdown/theme-nord/style.css';

// const markdown = `# Milkdown Next Commonmark

// > You're scared of a world where you're needed.

// This is a demo for using Milkdown with **Next**.`;

const markdown = `# Milkdown Editor Crepe

> This is a demo for using [Milkdown](https://milkdown.dev) editor crepe.

Let's add some content to the editor.

---

# Pink Floyd

![1.0](https://upload.wikimedia.org/wikipedia/en/d/d6/Pink_Floyd_-_all_members.jpg "Pink Floyd in January 1968.")

> Rarely will you find Floyd dishing up catchy hooks, tunes short enough for air-play, or predictable three-chord blues progressions; and never will you find them spending much time on the usual pop album of romance, partying, or self-hype. Their sonic universe is expansive, intense, and challenging ... Where most other bands neatly fit the songs to the music, the two forming a sort of autonomous and seamless whole complete with memorable hooks, Pink Floyd tends to set lyrics within a broader soundscape that often seems to have a life of its own ... Pink Floyd employs extended, stand-alone instrumentals which are never mere vehicles for showing off virtuoso but are planned and integral parts of the performance.

**Pink Floyd** are an English [rock](https://en.wikipedia.org/wiki/Rock_music "Rock music") band formed in London in 1965. Gaining an early following as one of the first British [psychedelic](https://en.wikipedia.org/wiki/Psychedelic_music "Psychedelic music") groups, they were distinguished by their extended compositions, sonic experiments, philosophical lyrics, and elaborate [live shows](https://en.wikipedia.org/wiki/Pink_Floyd_live_performances "Pink Floyd live performances"). They became a leading band of the [progressive rock](https://en.wikipedia.org/wiki/Progressive_rock "Progressive rock") genre, cited by some as the greatest progressive rock band of all time.

Pink Floyd were founded in 1965 by [Syd Barrett](https://en.wikipedia.org/wiki/Syd_Barrett "Syd Barrett") (guitar, lead vocals), [Nick Mason](https://en.wikipedia.org/wiki/Nick_Mason "Nick Mason") (drums), [Roger Waters](https://en.wikipedia.org/wiki/Roger_Waters "Roger Waters") (bass guitar, vocals) and [Richard Wright](https://en.wikipedia.org/wiki/Richard_Wright_\\(musician\\) "Richard Wright (musician)") (keyboards, vocals). With Barrett as their main songwriter, they released two hit singles, "[Arnold Layne](https://en.wikipedia.org/wiki/Arnold_Layne "Arnold Layne")" and "[See Emily Play](https://en.wikipedia.org/wiki/See_Emily_Play "See Emily Play")", and the successful debut album *[The Piper at the Gates of Dawn](https://en.wikipedia.org/wiki/The_Piper_at_the_Gates_of_Dawn "The Piper at the Gates of Dawn")* (all 1967). [David Gilmour](https://en.wikipedia.org/wiki/David_Gilmour "David Gilmour") (guitar, vocals) joined in December 1967, while Barrett left in April 1968 due to deteriorating mental health. The four remaining members began contributing to the musical composition, with Waters becoming the primary lyricist and thematic leader, devising the [concepts](https://en.wikipedia.org/wiki/Concept_album "Concept album") behind Pink Floyd's most successful albums, *[The Dark Side of the Moon](https://en.wikipedia.org/wiki/The_Dark_Side_of_the_Moon "The Dark Side of the Moon")* (1973), *[Wish You Were Here](https://en.wikipedia.org/wiki/Wish_You_Were_Here_\\(Pink_Floyd_album\\) "Wish You Were Here (Pink Floyd album)")* (1975), *[Animals](https://en.wikipedia.org/wiki/Animals_\\(Pink_Floyd_album\\))* (1977) and *[The Wall](https://en.wikipedia.org/wiki/The_Wall "The Wall")* (1979). The [musical film](https://en.wikipedia.org/wiki/Musical_film "Musical film") based on *The Wall*, *[Pink Floyd – The Wall](https://en.wikipedia.org/wiki/Pink_Floyd_%E2%80%93_The_Wall "Pink Floyd – The Wall")* (1982), won two [BAFTA Awards](https://en.wikipedia.org/wiki/BAFTA_Awards "BAFTA Awards"). Pink Floyd also composed several [film scores](https://en.wikipedia.org/wiki/Film_score "Film score").

---

## Discography

*Main articles: [Pink Floyd discography](https://en.wikipedia.org/wiki/Pink_Floyd_discography "Pink Floyd discography") and [List of songs recorded by Pink Floyd](https://en.wikipedia.org/wiki/List_of_songs_recorded_by_Pink_Floyd "List of songs recorded by Pink Floyd")*

**Studio albums**

* *[The Piper at the Gates of Dawn](https://en.wikipedia.org/wiki/The_Piper_at_the_Gates_of_Dawn "The Piper at the Gates of Dawn")* (1967)
* *[A Saucerful of Secrets](https://en.wikipedia.org/wiki/A_Saucerful_of_Secrets "A Saucerful of Secrets")* (1968)
* *[More](https://en.wikipedia.org/wiki/More_\\(soundtrack\\) "More (soundtrack)")* (1969)
* *[Ummagumma](https://en.wikipedia.org/wiki/Ummagumma "Ummagumma")* (1969)
* *[Atom Heart Mother](https://en.wikipedia.org/wiki/Atom_Heart_Mother "Atom Heart Mother")* (1970)
* *[Meddle](https://en.wikipedia.org/wiki/Meddle "Meddle")* (1971)
* *[Obscured by Clouds](https://en.wikipedia.org/wiki/Obscured_by_Clouds "Obscured by Clouds")* (1972)
* *[The Dark Side of the Moon](https://en.wikipedia.org/wiki/The_Dark_Side_of_the_Moon "The Dark Side of the Moon")* (1973)
* *[Wish You Were Here](https://en.wikipedia.org/wiki/Wish_You_Were_Here_\\(Pink_Floyd_album\\) "Wish You Were Here (Pink Floyd album)")* (1975)
* *[Animals](https://en.wikipedia.org/wiki/Animals_\\(Pink_Floyd_album\\) "Animals (Pink Floyd album)")* (1977)
* *[The Wall](https://en.wikipedia.org/wiki/The_Wall "The Wall")* (1979)
* *[The Final Cut](https://en.wikipedia.org/wiki/The_Final_Cut_\\(album\\) "The Final Cut (album)")* (1983)
* *[A Momentary Lapse of Reason](https://en.wikipedia.org/wiki/A_Momentary_Lapse_of_Reason "A Momentary Lapse of Reason")* (1987)
* *[The Division Bell](https://en.wikipedia.org/wiki/The_Division_Bell "The Division Bell")* (1994)
* *[The Endless River](https://en.wikipedia.org/wiki/The_Endless_River "The Endless River")* (2014)

`;

// Extend HTMLDivElement to allow __quill property
declare global {
	interface HTMLDivElement {
		__quill?: unknown;
	}
}

interface ProblemProps {
	descriptionReadonly?: boolean;
	showSubmissions?: boolean;
}

const insertLink = (ctx: Ctx) => {
	const view = ctx.get(editorViewCtx);
	const { selection, doc } = view.state;

	if (selection.empty) return;

	// already in edit mode
	if (ctx.get(linkTooltipState.key).mode === "edit") return;

	const has = doc.rangeHasMark(selection.from, selection.to, linkSchema.type(ctx));
	// range already has link
	if (has) return;

	ctx.get(linkTooltipAPI.key).addLink(selection.from, selection.to);
};

export default function Problem({ descriptionReadonly = false, showSubmissions = false }: ProblemProps) {
	const { state, isMobile } = useSidebar();
	const [tabValue, setTabValue] = useState("description");

	return (
		<div
			className={cn("grid h-auto grid-cols-1 gap-2 p-2 lg:h-full lg:max-h-full lg:grid-cols-2 lg:overflow-y-hidden", {
				"max-w-[calc(100vw-16rem)]": state == "expanded" && !isMobile,
				"md:h-full md:max-h-full md:grid-cols-2 md:overflow-y-hidden": state != "expanded" && !isMobile,
			})}>
			<Card className="h-auto min-h-[13rem] overflow-y-hidden px-2 py-[8px] lg:h-full lg:max-h-full">
				<Tabs
					value={tabValue}
					onValueChange={setTabValue}
					className={cn("h-auto w-full lg:h-[calc(100%-3rem)] lg:max-h-full", {
						"h-full lg:h-full": descriptionReadonly,
						"h-full md:h-full lg:h-full": state != "expanded" && !isMobile && descriptionReadonly,
					})}>
					<div className="flex w-full flex-wrap items-center justify-between gap-3 lg:flex-nowrap">
						<TabsList>
							<TabsTrigger value="description">Description</TabsTrigger>
							{showSubmissions && <TabsTrigger value="submissions">Submissions</TabsTrigger>}
						</TabsList>
						{tabValue === "description" && (
							<Button
								variant="secondary"
								className="w-fit"
								onClick={() => {
									const editor = document.getElementById("editor") as HTMLDivElement | null;
									// if (editor && editor.__quill) {
									//     const content = editor.__quill.getContents();
									//     console.log("Content to save:", content);
									// }
								}}>
								<Save />
								<span className="sr-only">Save</span>
							</Button>
						)}
					</div>
					<TabsContent value="description" className="h-auto w-full lg:h-full lg:max-h-full" id="editor-bounds">
						<div id="editor" className="h-full w-full overflow-y-auto">
							<MilkdownProvider>
								<CrepeEditor />
							</MilkdownProvider>
						</div>
					</TabsContent>
					{showSubmissions && <TabsContent value="submissions" className="w-full"></TabsContent>}
				</Tabs>
			</Card>
			<div className="grid grid-cols-1 gap-2">
				<Card className="">code editor</Card>
				<Card className="">compiler output</Card>
			</div>
		</div>
	);
}

export const MilkdownEditor: React.FC = () => {
	useEditor((root) => {
		const editor = Editor.make()
			.config((ctx) => {
				ctx.set(rootCtx, root);
				ctx.set(defaultValueCtx, markdown);
				ctx.update(codeBlockConfig.key, (defaultConfig) => ({
					...defaultConfig,
					languages,
					extensions: [basicSetup, oneDark, keymap.of(defaultKeymap)],
					renderLanguage: (language, selected) => {
						return `${selected ? "✓ " : ""}${language}`;
					},
				}));
				configureLinkTooltip(ctx);
			})
			.config(nord)
			.use(commonmark)
			.use(codeBlockComponent)
			.use(imageBlockComponent)
			.use(linkTooltipPlugin);

		return editor;
	}, []);

	React.useEffect(() => {
		const insertLinkButton = document.createElement("button");
		insertLinkButton.className = "insert-link-button";
		insertLinkButton.textContent = "🔗";
		document.body.prepend(insertLinkButton);
		insertLinkButton.onclick = () => {
			// You may want to get the editor instance here if needed
			// For now, this is a placeholder
		};
		return () => {
			insertLinkButton.remove();
		};
	}, []);

	return <Milkdown />;
};

const CrepeEditor: React.FC = () => {
	const { get } = useEditor((root) => {
		return new Crepe({
			root: "#editor",
			defaultValue: markdown,
		});
	});

	return <Milkdown />;
};
