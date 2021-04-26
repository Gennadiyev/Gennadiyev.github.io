# Write file

## Snippet

```python
with open("/storage/emulated/0/Download/tmp.txt", "w") as file:
	file.write("Hello\n")
	file.write("123\n")
	file.write("85g butter\n")
```

## Notes

### Different modes to open a file:

- `w`: This mode allows you to write to a file. It erases the contents of a file and creates a new one.

- `a`: This mode appends information to the end of a file.

- `r+`: This mode allows you to read information from and write data to a file.

- `a+`: This mode allows you to add information to the end of a file and read the file.

- `x`: Creates a file if one does not already exist to which we can add data.

## References

- [Python Write to File](https://careerkarma.com/blog/python-write-to-file/)
