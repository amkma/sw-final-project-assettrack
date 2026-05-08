package com.assettrack.sw_final_project_assettrack.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
@Entity
@Table(name = "History")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class History {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false)
    private String note;

    @Column(nullable = false)
    private LocalDate assignedAt;
    
    private LocalDate returnedAt;


    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Asset asset;
    
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private User fromUser;
    
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private User toUser ;

   
}
