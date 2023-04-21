
import { View, Text, Preesable, StyleSheet, Image, ScrollView} from "react-native"
import Sample1 from "../../theme/assets/images/sample/sample1.png";
import Sample2 from "../../theme/assets/images/sample/sample2.png";
import Sample3 from "../../theme/assets/images/sample/sample3.png";
import Sample4 from "../../theme/assets/images/sample/sample4.png";
import Sample5 from "../../theme/assets/images/sample/sample5.png";
import PlusBtn from "../../theme/assets/images/plus-solid.svg";
import SampleProfile1 from "../../theme/assets/images/sample/sample_profile1.png";
import SampleProfile2 from "../../theme/assets/images/sample/sample_profile2.png";
import { Colors, FontSize } from "../../theme/Variables";
import { WithLocalSvg } from 'react-native-svg';
export default  ListContent = () => {
    // 사진 개수가 많으면 scorllEnabled true 설정
    return (<View style={styles.container}>
        <View style={styles.content}>
            <ScrollView horizontal={true} scrollEnabled={false}>
             <ImageBox image ={Sample1}/>
              <ImageBox image ={Sample2}/>
             <ImageBox image ={Sample3}/>
             <ImageBox image ={Sample3}/>
             <ImageBox image ={Sample3}/>
             <ImageBox image ={Sample3}/>
             <ImageBox image ={Sample3}/>
             <ImageBox image ={Sample3}/>
            </ScrollView>


        </View>
       
       <View style={{width: '100%', flexDirection: 'row', marginTop: 10}}>
            <View style={{width: '60%'}}>
                <Text style={styles.title}>배낭여행 1일차</Text>
                <Text style={styles.location}>대한민국 서울 · 2023.04.21 </Text>
            </View>
            <View style={{width: '40%', flexDirection: 'row', alignItems : 'flex-end', justifyContent: 'flex-end'}}>
                <ProfileImg image={SampleProfile1}/> 
                <ProfileImg image={SampleProfile2}/>
                <Text style={{fontSize: FontSize.tiny}}>+3</Text>
            </View>
       </View>
       
    

    </View>)
}

const ImageBox = ({image}) => {
    return (<Image source={image} style={styles.img} />)
}

const ProfileImg = ({image}) => {
    return (<Image source={image} style={styles.profile} />)
}


const styles = StyleSheet.create({
    container : {
        paddingLeft: 10,
        paddingRight: 10,
        width: '100%',
        height: 170,
        justifyContent:'center',
        backgroundColor: Colors.white,
        marginBottom: 10,
    },
    content : {
        flexDirection:'row',
        shadowColor:"#000000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3
    },
    img: {
        marginRight: 7,
        width: 90,
        height: 90,
        borderRadius: 7
    },
    title: {
        fontSize: FontSize.regular,
        fontWeight: 600
    },
    location: {
        fontSize: FontSize.small,
    },
    profile: {
        width: 30,
        height: 30,
        borderRadius: 100,
        marginRight:7
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    }
    
    
})