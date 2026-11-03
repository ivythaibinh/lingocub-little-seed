# Nông trại – audio sources

166 clips: `<id>_en.mp3` and `<id>_zh.mp3` for every entry in the farm word list (73 words + 10 weather sentences).
Format: MP3, mono, 24 kHz, 48 kbps CBR. Silence trimmed (about 60 ms left at each end, 8 ms fades), loudness normalised to about -16 LUFS (measured -16.9 to -16.3), lookahead-limited, decoded peak at or below -1.2 dBFS (no clipping). Word clips run 0.50–1.55 s; sentences 1.11–1.43 s.

## Sources

- **EN Kokoro**: Kokoro-82M v1.0 (kokoro-onnx 0.6.1, `kokoro-v1.0.onnx` + `voices-v1.0.bin` from the thewh1teagle/kokoro-onnx GitHub release `model-files-v1.0`), voice `af_heart`, speed 1.0. Words are spoken as "Word." (with a period). espeak-ng en-us phonemes.
- **ZH human**: real recordings by Yue Tan from [hugolpz/audio-cmn](https://github.com/hugolpz/audio-cmn) `96k/hsk/cmn-<汉字>.mp3`, licence CC-BY-SA (credit: Yue Tan / Shtooka, curated by Hugo Lopez). Used only where the filename has exactly the same characters as the word; nothing was cut out of a longer recording. Re-encoded to the spec above.
- **ZH Kokoro**: same Kokoro v1.0 model, Mandarin female voice (mostly `zf_xiaoyi`; `zf_xiaobei` or `zf_xiaoxiao` where noted), phonemes from misaki[zh] 0.7.4 (pypinyin + jieba), checked against the given pinyin. Kokoro speed 1.0, then slowed to 0.8× with ffmpeg `atempo` (pitch unchanged), except the two noted rows.
- **Unit 10 reuse**: the approved clips embedded in `unit-10/practice/index.html` (`D.audio`). The page code builds `s_<w>_en` = "It's <w> today." (Buffy, female voice) and `s_<w>_zh` = `WD[w].sz + "。"`, so the keys match these sentences exactly. They were decoded, trimmed, normalised and re-encoded. Unit 10 has no record of the TTS voice used; its own comment calls the Chinese voice "Baker". So these 14 clips may not sound like af_heart / zf_xiaoyi.

Voice choice for Chinese: the four female voices were compared on test words with the ASR check below. `zf_xiaoyi` read correctly most often; `zf_xiaobei` was second.

## Per clip

| id | EN text | EN source | ZH text | pinyin | ZH source |
|---|---|---|---|---|---|
| carrot | Carrot. | Kokoro `af_heart` | 胡萝卜 | húluóbo | Kokoro `zf_xiaoyi`, ph `xu↗lwo↗pwo.` |
| potato | Potato. | Kokoro `af_heart` | 土豆 | tǔdòu | human: audio-cmn `96k/hsk/cmn-土豆.mp3` |
| cabbage | Cabbage. | Kokoro `af_heart` | 白菜 | báicài | human: audio-cmn `96k/hsk/cmn-白菜.mp3` |
| tomato | Tomato. | Kokoro `af_heart` | 西红柿 | xīhóngshì | human: audio-cmn `96k/hsk/cmn-西红柿.mp3` |
| sweetpotato | Sweet potato. | Kokoro `af_heart` | 红薯 | hóngshǔ | Kokoro `zf_xiaoyi`, ph `xʊ↗ŋʂu↓` |
| strawberry | Strawberry. | Kokoro `af_heart` | 草莓 | cǎoméi | Kokoro `zf_xiaoyi`, ph `ʦʰau̯↓mei̯↗` |
| sunflower | Sunflower. | Kokoro `af_heart` | 向日葵 | xiàngrìkuí | Kokoro `zf_xiaoyi`, ph `ɕja↘ŋɻɨ↘kʰwei̯↗` |
| cucumber | Cucumber. | Kokoro `af_heart` | 黄瓜 | huángguā | human: audio-cmn `96k/hsk/cmn-黄瓜.mp3` |
| corn | Corn. | Kokoro `af_heart` | 玉米 | yùmǐ | human: audio-cmn `96k/hsk/cmn-玉米.mp3` |
| rice | Rice. | Kokoro `af_heart` | 水稻 | shuǐdào | human: audio-cmn `96k/hsk/cmn-水稻.mp3` |
| pumpkin | Pumpkin. | Kokoro `af_heart` | 南瓜 | nánguā | Kokoro `zf_xiaoyi`, ph `na↗nkwa→` |
| watermelon | Watermelon. | Kokoro `af_heart` | 西瓜 | xīguā | human: audio-cmn `96k/hsk/cmn-西瓜.mp3` |
| tulip | Tulip. | Kokoro `af_heart` | 郁金香 | yùjīnxiāng | Kokoro `zf_xiaoyi`, ph `y↘ʨi→nɕja→ŋ` |
| goldpumpkin | Golden pumpkin. | Kokoro `af_heart` | 金南瓜 | jīn nánguā | Kokoro `zf_xiaoyi`, ph `ʨi→n na↗nkwa→` |
| whitestrawberry | White strawberry. | Kokoro `af_heart` | 白草莓 | bái cǎoméi | Kokoro `zf_xiaoyi`, ph `pai̯↗ ʦʰau̯↓mei̯↗` |
| bananatree | Banana tree. | Kokoro `af_heart` | 香蕉树 | xiāngjiāoshù | Kokoro `zf_xiaoyi`, ph `ɕja→ŋʨjau̯→ ʂu↘` |
| appletree | Apple tree. | Kokoro `af_heart` | 苹果树 | píngguǒshù | Kokoro `zf_xiaoyi`, ph `pʰi↗ŋkwo↓ʂu↘` |
| orangetree | Orange tree. | Kokoro `af_heart` | 橙子树 | chéngzishù | Kokoro `zf_xiaoyi`, ph `ꭧʰə↗ŋʦɨ ʂu↘` |
| mangotree | Mango tree. | Kokoro `af_heart` | 芒果树 | mángguǒshù | Kokoro `zf_xiaoyi`, ph `ma↗ŋkwo↓ʂu↘` |
| peachtree | Peach tree. | Kokoro `af_heart` | 桃树 | táoshù | Kokoro `zf_xiaoyi`, ph `tʰau̯↗ʂu↘.` |
| coconuttree | Coconut tree. | Kokoro `af_heart` | 椰子树 | yēzishù | Kokoro `zf_xiaoyi`, ph `je→ʦɨʂu↘` |
| lycheetree | Lychee tree. | Kokoro `af_heart` **(ASR unverified)** | 荔枝树 | lìzhīshù | Kokoro `zf_xiaoyi`, ph `li↘ꭧɨ→ʂu↘!` |
| cherrytree | Cherry tree. | Kokoro `af_heart` | 樱桃树 | yīngtáoshù | Kokoro `zf_xiaoyi`, ph `i→ŋtʰau̯↗ʂu↘` |
| banana | Banana. | Kokoro `af_heart` | 香蕉 | xiāngjiāo | human: audio-cmn `96k/hsk/cmn-香蕉.mp3` |
| apple | Apple. | Kokoro `af_heart` | 苹果 | píngguǒ | human: audio-cmn `96k/hsk/cmn-苹果.mp3` |
| orange | Orange. | Kokoro `af_heart` | 橙子 | chéngzi | Kokoro `zf_xiaoyi`, ph `ꭧʰə↗ŋʦɨ.` |
| mango | Mango. | Kokoro `af_heart` | 芒果 | mángguǒ | Kokoro `zf_xiaoyi`, ph `ma↗ŋkwo↓.` |
| peach | Peach. | Kokoro `af_heart`, phoneme override `pˈiːʧ!` | 桃子 | táozi | Kokoro `zf_xiaoyi`, ph `tʰau̯↗ʦɨ.` |
| coconut | Coconut. | Kokoro `af_heart` | 椰子 | yēzi | Kokoro `zf_xiaoyi`, ph `je→ʦɨ` |
| lychee | Lychee. | Kokoro `af_heart` **(ASR unverified)** | 荔枝 | lìzhī | human: audio-cmn `96k/hsk/cmn-荔枝.mp3` |
| cherry | Cherry. | Kokoro `af_heart` | 樱桃 | yīngtáo | Kokoro `zf_xiaoyi`, ph `i→ŋtʰau̯↗` |
| chicken | Chicken. | Kokoro `af_heart` | 鸡 | jī | human: audio-cmn `96k/hsk/cmn-鸡.mp3` |
| duck | Duck. | Kokoro `af_heart` | 鸭子 | yāzi | human: audio-cmn `96k/hsk/cmn-鸭子.mp3` |
| rabbit | Rabbit. | Kokoro `af_heart` | 兔子 | tùzi | human: audio-cmn `96k/hsk/cmn-兔子.mp3` |
| cat | Cat. | Kokoro `af_heart` | 猫 | māo | human: audio-cmn `96k/hsk/cmn-猫.mp3` |
| dog | Dog. | Kokoro `af_heart` | 狗 | gǒu | human: audio-cmn `96k/hsk/cmn-狗.mp3` |
| pig | Pig. | Kokoro `af_heart` | 猪 | zhū | human: audio-cmn `96k/hsk/cmn-猪.mp3` |
| cow | Cow. | Kokoro `af_heart` | 奶牛 | nǎiniú | Kokoro `zf_xiaoyi`, ph `nai̯↓njou̯↗` |
| buffalo | Buffalo. | Kokoro `af_heart` | 水牛 | shuǐniú | Kokoro `zf_xiaoyi`, ph `“ʂwei̯↓njou̯↗”` |
| egg | Egg. | Kokoro `af_heart` | 鸡蛋 | jīdàn | human: audio-cmn `96k/hsk/cmn-鸡蛋.mp3` |
| duckegg | Duck egg. | Kokoro `af_heart` | 鸭蛋 | yādàn | Kokoro `zf_xiaoyi`, ph `ja→ta↘n` |
| milk | Milk. | Kokoro `af_heart` | 牛奶 | niúnǎi | human: audio-cmn `96k/hsk/cmn-牛奶.mp3` |
| wateringcan | Watering can. | Kokoro `af_heart` | 喷壶 | pēnhú | Kokoro `zf_xiaoyi`, ph `pʰə→nxu↗` |
| shovel | Shovel. | Kokoro `af_heart` | 铲子 | chǎnzi | Kokoro `zf_xiaoyi`, ph `ꭧʰa↓nʦɨ.` |
| basket | Basket. | Kokoro `af_heart` | 篮子 | lánzi | human: audio-cmn `96k/hsk/cmn-篮子.mp3` |
| raincoat | Raincoat. | Kokoro `af_heart` | 雨衣 | yǔyī | human: audio-cmn `96k/hsk/cmn-雨衣.mp3` |
| fertilizer | Fertilizer. | Kokoro `af_heart` | 肥料 | féiliào | human: audio-cmn `96k/hsk/cmn-肥料.mp3` |
| blanket | Blanket. | Kokoro `af_heart` | 毯子 | tǎnzi | human: audio-cmn `96k/hsk/cmn-毯子.mp3` |
| sunshade | Sun shade. | Kokoro `af_heart` | 遮阳网 | zhēyángwǎng | Kokoro `zf_xiaobei`, ph `ꭧɤ→ja↗ŋwa↓ŋ` |
| fence | Fence. | Kokoro `af_heart`, phoneme override `“fˈɛns.”` | 篱笆 | líba | human: audio-cmn `96k/hsk/cmn-篱笆.mp3` |
| lantern | Lantern. | Kokoro `af_heart` | 灯笼 | dēnglong | human: audio-cmn `96k/hsk/cmn-灯笼.mp3` |
| shelter | Rain shelter. | Kokoro `af_heart` | 雨棚 | yǔpéng | Kokoro `zf_xiaoyi`, Kokoro speed 0.8 (no atempo), ph `y↓pʰə↗ŋ!` |
| scarecrow | Scarecrow. | Kokoro `af_heart` | 稻草人 | dàocǎorén | Kokoro `zf_xiaoyi`, ph `tau̯↘ʦʰau̯↓ɻə↗n` |
| pond | Pond. | Kokoro `af_heart` | 池塘 | chítáng | human: audio-cmn `96k/hsk/cmn-池塘.mp3` |
| well | Well. | Kokoro `af_heart` | 水井 | shuǐjǐng | Kokoro `zf_xiaoyi`, ph `“ʂwei̯↓ʨi↓ŋ”` |
| wheelbarrow | Wheelbarrow. | Kokoro `af_heart` | 手推车 | shǒutuīchē | Kokoro `zf_xiaoyi`, ph `ʂou̯↓tʰwei̯→ꭧʰɤ→.` |
| bigbarn | Barn. | Kokoro `af_heart` | 谷仓 | gǔcāng | Kokoro `zf_xiaobei`, ph `ku↓ʦʰa→ŋ.` |
| windmill | Windmill. | Kokoro `af_heart` | 风车 | fēngchē | Kokoro `zf_xiaoyi`, ph `fə→ŋꭧʰɤ→` |
| greenhouse | Greenhouse. | Kokoro `af_heart` | 温室 | wēnshì | Kokoro `zf_xiaoyi`, ph `wə→nʂɨ↘.` |
| tractor | Tractor. | Kokoro `af_heart` | 拖拉机 | tuōlājī | human: audio-cmn `96k/hsk/cmn-拖拉机.mp3` |
| flower | Flower. | Kokoro `af_heart` | 花 | huā | human: audio-cmn `96k/hsk/cmn-花.mp3` |
| sign | Farm sign. | Kokoro `af_heart` | 牌子 | páizi | human: audio-cmn `96k/hsk/cmn-牌子.mp3` |
| bench | Bench. | Kokoro `af_heart` | 长椅 | chángyǐ | Kokoro `zf_xiaoxiao`, ph `ꭧʰa↗ŋi↓!` |
| swing | Swing. | Kokoro `af_heart` | 秋千 | qiūqiān | Kokoro `zf_xiaoyi`, ph `ʨʰjou̯→ʨʰjɛ→n` |
| bridge | Little bridge. | Kokoro `af_heart` | 小桥 | xiǎoqiáo | Kokoro `zf_xiaoyi`, ph `ɕjau̯↓ ʨʰjau̯↗.` |
| rainbowarch | Rainbow arch. | Kokoro `af_heart` | 彩虹门 | cǎihóngmén | Kokoro `zf_xiaoyi`, ph `ʦʰai̯↓xʊ↗ŋmə↗n` |
| rainbowflower | Rainbow flower. | Kokoro `af_heart` | 彩虹花 | cǎihónghuā | Kokoro `zf_xiaoyi`, ph `ʦʰai̯↓xʊ↗ŋ xwa→` |
| giantpumpkin | Giant pumpkin. | Kokoro `af_heart` | 大南瓜 | dà nánguā | Kokoro `zf_xiaoyi`, ph `ta↘ na↗nkwa→` |
| goldlantern | Golden lantern. | Kokoro `af_heart` | 金灯笼 | jīn dēnglong | Kokoro `zf_xiaoyi`, ph `ʨi→n tə→ŋlʊŋ.` |
| trophy | Farm trophy. | Kokoro `af_heart` | 奖杯 | jiǎngbēi | Kokoro `zf_xiaoyi`, Kokoro speed 1.1 + atempo 0.727 (net 0.8×), ph `ʨja↓ŋpei̯→!` |
| smallplot | Small plot. | Kokoro `af_heart` | 小块地 | xiǎo kuài dì | Kokoro `zf_xiaoyi`, ph `ɕjau̯↓kʰwai̯↘ ti↘` |
| mediumplot | Medium plot. | Kokoro `af_heart` | 中块地 | zhōng kuài dì | Kokoro `zf_xiaoyi`, ph `ꭧʊ→ŋkʰwai̯↘ ti↘` |
| largeplot | Large plot. | Kokoro `af_heart` | 大块地 | dà kuài dì | Kokoro `zf_xiaoyi`, ph `ta↘kʰwai̯↘ ti↘` |
| w-sunny | It's sunny today. | Unit 10 reuse `s_sunny_en` | 今天晴天。 | jīntiān qíngtiān | Unit 10 reuse `s_sunny_zh` |
| w-cloudy | It's cloudy today. | Unit 10 reuse `s_cloudy_en` | 今天阴天。 | jīntiān yīntiān | Unit 10 reuse `s_cloudy_zh` |
| w-rainbow | There's a rainbow today. | Kokoro `af_heart` | 今天有彩虹。 | jīntiān yǒu cǎihóng | Kokoro `zf_xiaoyi`, ph `ʨi→ntʰjɛ→n jou̯↓ ʦʰai̯↓xʊ↗ŋ。` |
| w-rainy | It's rainy today. | Unit 10 reuse `s_rainy_en` | 今天下雨。 | jīntiān xià yǔ | Unit 10 reuse `s_rainy_zh` |
| w-windy | It's windy today. | Unit 10 reuse `s_windy_en` | 今天刮风。 | jīntiān guā fēng | Unit 10 reuse `s_windy_zh` |
| w-stormy | It's stormy today. | Kokoro `af_heart` | 今天有雷雨。 | jīntiān yǒu léiyǔ | Kokoro `zf_xiaoyi`, ph `ʨi→ntʰjɛ→n jou̯↓ lei̯↗y↓。` |
| w-hot | It's hot today. | Unit 10 reuse `s_hot_en` | 今天很热。 | jīntiān hěn rè | Unit 10 reuse `s_hot_zh` |
| w-cold | It's cold today. | Unit 10 reuse `s_cold_en` | 今天很冷。 | jīntiān hěn lěng | Unit 10 reuse `s_cold_zh` |
| w-snowy | It's snowy today. | Unit 10 reuse `s_snowy_en` | 今天下雪。 | jīntiān xià xuě | Unit 10 reuse `s_snowy_zh` |
| w-foggy | It's foggy today. | Kokoro `af_heart` | 今天有雾。 | jīntiān yǒu wù | Kokoro `zf_xiaoyi`, ph `ʨi→ntʰjɛ→n jou̯↓u↘。` |

## Checks and fixes

- **English OOV**: no word was dropped; espeak-ng had every word, and no OOV/skip warnings were logged. All EN clips have plausible length (0.50 s "Egg." to 1.43 s for sentences).
- **English pronunciation fixes**: for "Fence" the default rendering lost its /f/ onset (ASR heard "vs"); a quoted phoneme framing `“fˈɛns.”` fixed it. "Peach" came out with a weak final /tʃ/ (heard "peter"); the phoneme input `pˈiːʧ!` (single-codepoint ʧ, exclamation) fixed it. Both now pass ASR.
- **Chinese pinyin vs phonemes**: every entry was compared with the given `py`. Two misaki/pypinyin errors were fixed with explicit phonemes: 长椅 (pypinyin gave *zhǎngyǐ*; corrected to *chángyǐ* `ꭧʰa↗ŋi↓`), and 灯笼 inside 金灯笼 (pypinyin gave *lóng*; corrected to neutral *long* `lʊŋ`, matching *jīn dēnglong*). 篱笆 and 灯笼 also differ only in neutral tone, but both use human recordings. All others matched, e.g. 胡萝卜 xu↗lwo↗pwo (húluóbo), 有雾 jou↓u↘ (yǒu wù), 雷雨 lei↗y↓ (léiyǔ).
- **Kokoro Mandarin onset artefact**: at Kokoro speed 0.8 the voices often added a stray syllable before the word (ASR heard 你/一/及 + word). Generating at speed 1.0 and slowing with atempo 0.8 avoided it. Each Kokoro clip was picked from several framings (plain, trailing "."/"!", quotes, per-syllable spacing) and voices, and kept only if ASR read the final MP3 correctly at two levels.
- **ASR**: ran. Model: SenseVoice-Small int8 (sherpa-onnx `sherpa-onnx-sense-voice-zh-en-ja-ko-yue-2024-07-17`, from k2-fsa GitHub releases). Whisper / faster-whisper weights could not be downloaded here (Hugging Face and OpenAI hosts blocked). On the human recordings and Unit 10 clips it was exact, so it is a usable check. Chinese was matched by toned pinyin, because homophones like 快递 = 块地 are fine. English was matched on the bare clip, or after a short "a cat" carrier phrase for isolated words.

## Unverified / please listen

- `lychee_en`, `lycheetree_en`: ASR never wrote "lychee" (it heard "licci", "leachci"). That is probably a gap in its vocabulary, since espeak gives /ˈliːtʃiː/ (LEE-chee, US usage), but no clip passed. Also, some teachers prefer /ˈlaɪtʃiː/; check which one you want.
- `bench_zh` 长椅 (zf_xiaoxiao, phoneme override): ASR heard 常以 cháng yǐ, which has the right tones, but this word failed ASR in 20 of 21 tries (椅 often heard as 蝇/怡), so it is the weakest Kokoro clip.
- `bridge_zh` 小桥, `rainbowflower_zh` 彩虹花, `lycheetree_zh` 荔枝树, `shelter_zh` 雨棚: pass on pinyin (heard as homophones 小乔 / 彩红花 / 荔枝数 / 雨鹏); worth a quick listen. `shelter_zh` and `trophy_zh` needed a different speed path (see table).
- `smallplot_zh`, `mediumplot_zh`, `largeplot_zh`: ASR heard 快递 (same sound as 块地): correct.
- The 14 Unit 10 clips (7 EN + 7 ZH) are a different voice from the rest (see Sources).
- Human recordings (Yue Tan) are an adult female voice and sound different from Kokoro.
