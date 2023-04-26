import Modal from "../modal/Modal"
import { AlignProps } from "../../types"
import ModalHeader from "../modal/ModalHeader"
import ModalBody from "../modal/ModalBody"
import ModalFooter from "../modal/ModalFooter"
import { GLOBAL } from "../../utils"

/**
 * Returns a React Modal component containing the Help section.
 */
const HelpModal = ({align}: AlignProps) => {



    return (
        <Modal
        button={{ align: align, children: "Help!" }}
        modal={{ width: `clamp(320px, 90%, 800px)`, height: "auto" }}
        >
            <ModalHeader>Help Section</ModalHeader>
            <ModalBody>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor sequi repellendus similique deleniti quos maiores doloremque dolores, magnam nemo? Non, doloremque? Iste, voluptatem recusandae omnis libero nihil minima explicabo! Placeat quisquam architecto molestiae consectetur repellendus maxime maiores sint cupiditate ipsum hic harum enim vitae veritatis doloremque, minima aut esse dolores ab dignissimos quae! Quaerat minus sint cupiditate qui cum sequi est. Illo, laborum ipsum error animi sapiente similique beatae debitis culpa ab, magni dolores explicabo voluptatum enim, ea atque sunt recusandae sed est. Quae deserunt veritatis neque, quia, sequi optio ad obcaecati nobis provident, alias magni nesciunt quasi? Aperiam odit voluptas exercitationem veniam a excepturi cumque delectus corrupti reiciendis tempore accusamus impedit iste nulla repellendus et soluta perferendis hic ipsum ratione, consectetur dignissimos sed amet. Exercitationem tempora expedita maxime dicta sed. Fugiat quibusdam exercitationem enim eos nisi eveniet placeat dolorem consectetur! Id architecto quas, perspiciatis eos modi aliquam libero mollitia maiores minima nam esse deserunt animi officia non! Quaerat, reiciendis ad? Suscipit amet qui quod ducimus dicta adipisci laudantium vero quos alias illum tenetur modi earum explicabo, omnis pariatur labore rerum nihil nobis. Voluptas a at dolore repudiandae minima molestiae harum ducimus eaque natus expedita tempora necessitatibus voluptates qui, quia corporis soluta voluptatum nesciunt fugit neque fuga repellat odit. Dignissimos ad cupiditate, praesentium ipsum illum minima ratione obcaecati sed vel blanditiis iure esse eveniet doloremque id eligendi aliquam doloribus tempore laboriosam dolor labore dicta cum. Repellat velit asperiores excepturi facilis, quam illum incidunt hic accusamus nobis voluptates porro iure temporibus fugit alias quaerat magni, deleniti quisquam, rerum est provident accusantium perspiciatis? Officia, rem perferendis mollitia incidunt accusamus repellat perspiciatis voluptatibus exercitationem dolor a error molestiae voluptatum modi molestias accusantium recusandae, quibusdam nisi ducimus voluptas aperiam sapiente magni earum dicta. Nulla aliquam animi quaerat est ad odio debitis veritatis, quos quo commodi similique ullam blanditiis beatae quidem, suscipit atque aspernatur soluta aliquid accusamus fugiat. Quos quae eius cupiditate sapiente iste eos vero sed assumenda. Aspernatur, sed. Debitis quisquam aliquid doloremque error dolores iusto nihil in reiciendis hic ratione voluptate, harum mollitia incidunt. Maxime placeat minus autem et ipsum expedita dolore architecto similique dicta quam ea maiores sequi, facere, laboriosam error ratione itaque earum odit. Cum assumenda, neque in ratione minus illum sapiente natus corporis dicta dolor et autem magnam libero laudantium. Nesciunt neque voluptatibus est eum, praesentium voluptatum quae sit cupiditate quisquam reprehenderit modi officiis corrupti laborum id placeat nihil. Accusantium quibusdam ex esse facere similique laborum cupiditate assumenda aperiam impedit laboriosam temporibus sequi, soluta neque non, molestiae culpa id quo, est et voluptatem eius? Incidunt iusto rem odio est eligendi nostrum adipisci asperiores reprehenderit cum, temporibus eaque a ducimus, dolore beatae! Corporis ut voluptas rerum accusantium obcaecati doloribus quam facere exercitationem, earum illum amet perspiciatis pariatur maiores deleniti accusamus eveniet quasi numquam architecto veritatis iusto tempore? Ullam dolorum sunt nisi facere impedit recusandae itaque totam soluta! Animi sequi sit maxime vero fugit facere assumenda dicta rem nobis totam iure quidem incidunt soluta pariatur, doloremque ut deserunt eligendi placeat molestias nisi.</ModalBody>
            <ModalFooter>Help Footer</ModalFooter>
        </Modal>
    )
}

export default HelpModal