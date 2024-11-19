import sys

def main():
    # Check if an argument is passed
    if len(sys.argv) > 1:
        # Print the argument passed to the script
        print(f"Argument received: {sys.argv[1]}")
    else:
        print("No argument received.")

if __name__ == "__main__":
    main()