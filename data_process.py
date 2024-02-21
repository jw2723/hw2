import re

# def clean_words(words_list):
#     pattern = re.compile(r'[A-Za-z]')
#     cleaned_words = [word for word in words_list if not pattern.search(word)]
#     return cleaned_words


with open('/Users/jingqiwang/Desktop/In Progress/Cornell University/INFO 5311 visualization/hw2/most-common-words-by-language-master/src/resources/chinese.txt', 'r', encoding='utf-8') as file:
    chinese_words = file.read().splitlines()

with open('/Users/jingqiwang/Desktop/In Progress/Cornell University/INFO 5311 visualization/hw2/most-common-words-by-language-master/src/resources/japanese.txt', 'r', encoding='utf-8') as file:
    japanese_words = file.read().splitlines()


# clean to only chn words
def clean_chinese_words(words_list):
    # pattern to match only Chinese characters
    pattern = re.compile(r'[\u4e00-\u9fff]+')
    # filter out words that don't match the pattern
    cleaned_words = [word for word in words_list if pattern.fullmatch(word)]
    return cleaned_words

# clean to only jpn words
def clean_japanese_words(words_list):
    # pattern to match only Japanese characters (Hiragana, Katakana, Kanji)
    pattern = re.compile(r'[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+')
    # filter out words that don't match the pattern
    cleaned_words = [word for word in words_list if pattern.fullmatch(word)]
    return cleaned_words


# clean the Chinese words list
cleaned_chinese_words = clean_chinese_words(chinese_words)

# clean the Japanese words list
cleaned_japanese_words = clean_japanese_words(japanese_words)


print(cleaned_chinese_words)
print(cleaned_japanese_words)


# write to new cleaned_chinese file
with open('/Users/jingqiwang/Desktop/In Progress/Cornell University/INFO 5311 visualization/hw2/most-common-words-by-language-master/src/resources/cleaned_chinese.txt', 'w', encoding='utf-8') as file:
    for word in cleaned_chinese_words:
        file.write(f"{word}\n")

# write to new cleaned_japanese file
with open('/Users/jingqiwang/Desktop/In Progress/Cornell University/INFO 5311 visualization/hw2/most-common-words-by-language-master/src/resources/cleaned_japanese.txt', 'w', encoding='utf-8') as file:
    for word in cleaned_japanese_words:
        file.write(f"{word}\n")