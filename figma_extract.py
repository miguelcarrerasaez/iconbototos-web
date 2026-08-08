import json

data = json.load(open('figma_full.json', encoding='utf-8'))

def find_node(node, target_id):
    if node.get('id') == target_id:
        return node
    for child in node.get('children', []):
        result = find_node(child, target_id)
        if result:
            return result
    return None

node = find_node(data['document'], '7:99')

def extract_info(node, depth=0):
    if depth > 8:
        return
    name = node.get('name', '')
    ntype = node.get('type', '')
    abb = node.get('absoluteBoundingBox', {})
    style = node.get('style', {})
    layout = node.get('layoutMode', '')
    spacing = node.get('itemSpacing', '')
    pad = "p:{},{},{},{}".format(
        node.get('paddingLeft', ''),
        node.get('paddingRight', ''),
        node.get('paddingTop', ''),
        node.get('paddingBottom', '')
    )
    chars = node.get('characters', '')
    fs = style.get('fontSize', '')
    fw = style.get('fontWeight', '')
    ff = style.get('fontFamily', '')
    lh = style.get('lineHeightPx', '')
    ta = style.get('textAlignHorizontal', '')
    indent = '  ' * depth
    print("{}{} '{}' w={} h={} layout={} gap={} {} font={} fs={} fw={} lh={} ta={} chars='{}'".format(
        indent, ntype, name,
        abb.get('width', ''), abb.get('height', ''),
        layout, spacing, pad, ff, fs, fw, lh, ta, chars[:60]
    ))
    for child in node.get('children', []):
        extract_info(child, depth + 1)

extract_info(node)