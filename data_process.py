import re

# def clean_words(words_list):
#     pattern = re.compile(r'[A-Za-z]')
#     cleaned_words = [word for word in words_list if not pattern.search(word)]
#     return cleaned_words


# Read the Chinese words file
with open('/Users/jingqiwang/Desktop/In Progress/Cornell University/INFO 5311 visualization/hw2/most-common-words-by-language-master/src/resources/chinese.txt', 'r', encoding='utf-8') as file:
    chinese_words = file.read().splitlines()

# Read the Jap words file
with open('/Users/jingqiwang/Desktop/In Progress/Cornell University/INFO 5311 visualization/hw2/most-common-words-by-language-master/src/resources/japanese.txt', 'r', encoding='utf-8') as file:
    japanese_words = file.read().splitlines()

def clean_chinese_words(words_list):
    # Regular expression to match only Chinese characters
    pattern = re.compile(r'[\u4e00-\u9fff]+')
    
    # Filtering out words that don't match the pattern
    cleaned_words = [word for word in words_list if pattern.fullmatch(word)]
    
    return cleaned_words


def clean_japanese_words(words_list):
    # Regular expression to match Japanese characters (Hiragana, Katakana, Kanji)
    # Hiragana range: 3040-309F, Katakana range: 30A0-30FF, Kanji (Common & Uncommon): 4E00-9FAF
    pattern = re.compile(r'[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+')
    
    # Filtering out words that don't match the pattern
    cleaned_words = [word for word in words_list if pattern.fullmatch(word)]
    
    return cleaned_words


# Clean the Chinese words list
cleaned_chinese_words = clean_chinese_words(chinese_words)

# Clean the jap words list
cleaned_japanese_words = clean_japanese_words(japanese_words)


print(cleaned_chinese_words)
print(cleaned_japanese_words)


# Optionally, write the cleaned words to a new file
with open('/Users/jingqiwang/Desktop/In Progress/Cornell University/INFO 5311 visualization/hw2/most-common-words-by-language-master/src/resources/cleaned_chinese.txt', 'w', encoding='utf-8') as file:
    for word in cleaned_chinese_words:
        file.write(f"{word}\n")


# Optionally, write the cleaned words to a new file
with open('/Users/jingqiwang/Desktop/In Progress/Cornell University/INFO 5311 visualization/hw2/most-common-words-by-language-master/src/resources/cleaned_japanese.txt', 'w', encoding='utf-8') as file:
    for word in cleaned_japanese_words:
        file.write(f"{word}\n")