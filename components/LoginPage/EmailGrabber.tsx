import React from 'react';
interface ComponentProps{
    handleSubmit: VoidFunction
}
const EmailGrabber = ({handleSubmit}:ComponentProps) => {
    return (
        <React.Fragment>
                <div className='grid'>
                    <input autoComplete='false' placeholder='jméno.příjmení' type="email" id='emailName' className='bg-white text-center w-50 h-12 text-3xl outline-none row-start-1 row-end-2'/>
                    <p className='row-start-2 row-end-3 col-start-1 col-end-6 text-center text-lg h-12 text-blue-500 font-medium'>@teleinformatika.eu</p>
                </div>
                <input type="submit" onClick={handleSubmit} value="Pokračovat" className='mt-2 text-2xl py-2 cursor-pointer px-5 bg-violet-500 text-white rounded-lg duration-300 hover:bg-violet-600' />
        </React.Fragment>
    );
};

export default EmailGrabber;
