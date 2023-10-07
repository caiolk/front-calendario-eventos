import React from 'react';
import { NumberFormatBase } from 'react-number-format';



const NumberFormatCustom = (props:any) => {
    const { inputRef, onChange, decimalScale, ...other } = props;
    return (
        <NumberFormatBase
            {...other}
            getInputRef={inputRef}
            onValueChange={(values) => {
                onChange({
                        target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }} 
            allowLeadingZeros  
            decimalScale={ ( decimalScale ? decimalScale : 0 ) }
            prefix=""   
        />
    );
  }

  export default NumberFormatCustom;