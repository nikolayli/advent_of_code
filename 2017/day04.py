def read_input(file_path: str) -> str:
    with open(file_path, 'r') as file:
        return file.read()

def part_one(passphrase: str) -> bool:
    words = passphrase.split()
    return len(words) == len(set(words))

def part_two(passphrase: str) -> bool:
    words = passphrase.split()
    sorted_words = [''.join(sorted(word)) for word in words]
    return len(sorted_words) == len(set(sorted_words))

def count_valid_passphrases(passphrases: str, validation_function) -> int:
    passphrase_list = passphrases.strip().split('\n')
    return sum(validation_function(passphrase)
               for passphrase in passphrase_list)

if __name__ == "__main__":
    input_data = read_input('input.txt')

    valid_passphrase_count_part_one = count_valid_passphrases(
        input_data, part_one
    )
    valid_passphrase_count_part_two = count_valid_passphrases(
        input_data, part_two
    )

    print(f"Number of valid passphrases (Part One): "
          f"{valid_passphrase_count_part_one}")
    print(f"Number of valid passphrases (Part Two): "
          f"{valid_passphrase_count_part_two}")