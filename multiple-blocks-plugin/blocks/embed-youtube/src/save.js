import {RichText, useBlockProps, useInnerBlocksProps, InnerBlocks } from '@wordpress/block-editor';
import { parse } from '@wordpress/block-serialization-default-parser';


  export default function save(props) {
    //console.log(parse(InnerBlocks.Content().props.children))
    console.log("save");
    console.log(props);
    // console.log(parse(InnerBlocks.Content().props.children)[0]);
    // console.log(parse(InnerBlocks.Content().props.children)[0].attrs);
    // console.log(parse(InnerBlocks.Content().props.children)[0].attrs.url);
    //console.log(InnerBlocks.Content());
    const blockProps = useBlockProps.save();
    const innerBlocksProps = useInnerBlocksProps.save(blockProps);
    console.log(innerBlocksProps);
    let children = parse(innerBlocksProps.children.props.children);
    let url = "";
    if(children[0]) {
      url = children[0].attrs.url;
    } else {
      url = props.attributes.url;
    }
    // blockProps.attributes.url = innerBlocksProps.attributes.url;
    return(
      <div react-component="ReactPlayer" url={url}>
      </div>
      
  	)
  }