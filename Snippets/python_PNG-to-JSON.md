# PNG-to-JSON

## Snippet

```python
from PIL import Image
import numpy as np
import json
from json import JSONEncoder

# load the image
image = Image.open('/storage/emulated/0/Download/undraw_science_fqhl.png')
# convert image to numpy array
data = np.asarray(image)

class NumPyArrayEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return JSONEncoder.default(self, obj)

print(json.dumps(data, cls=NumPyArrayEncoder))
```

## Notes

The snippet uses package [pillow](https://python-pillow.org/) to parse and read the image and converts it into a numpy array. Then we use json encoder to convert the numpy array to a valid json string.

## References

- [Importing Image Data into NumPy Arrays](https://www.pluralsight.com/guides/importing-image-data-into-numpy-arrays)
- [Python Serialize NumPy ndarray into JSON](https://pynative.com/python-serialize-numpy-ndarray-into-json/#:~:text=Use%20the%20cls%20kwarg%20of%20the%20json.dump%20%28%29,a%20tolist%20%28%29%20function.%20Let%E2%80%99s%20see%20the%20demo.)
